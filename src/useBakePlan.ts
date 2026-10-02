import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INGREDIENTS, type Ingredient } from './ingredients';

export type Step = 'home' | 'plan' | 'cooking' | 'done';
export type CatFilter = 'all' | 'veg' | 'protein';

export interface RecentBake {
  key: string;
  ids: string[];
  temp: number;
  prep: number;
  label: string;
  savedAt: number;
}

export interface BakeGroup {
  addAt: number;
  duration: number;
  items: Ingredient[];
  namesText: string;
}

const RECENT_STORAGE_KEY = 'bakeplan_recent_v1';
const TEMP_OPTIONS = [375, 400, 425, 450];

function modeTemp(list: number[]): number | null {
  if (!list.length) return null;
  const counts: Record<number, number> = {};
  list.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  let best: number | null = null;
  let bestCount = -1;
  Object.keys(counts).forEach((k) => {
    const n = Number(k);
    const c = counts[n];
    if (c > bestCount || (c === bestCount && Math.abs(n - 400) < Math.abs((best ?? 400) - 400))) {
      best = n;
      bestCount = c;
    }
  });
  return best;
}

function prepSuggestion(count: number): number {
  if (!count) return 15;
  const raw = 8 + count * 4;
  const rounded = Math.round(raw / 5) * 5;
  return Math.min(35, Math.max(10, rounded));
}

export function fmtTime(secs: number): string {
  secs = Math.max(0, Math.round(secs));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function computeGroups(selected: Ingredient[]): BakeGroup[] {
  if (!selected.length) return [];
  const byTime: Record<number, Ingredient[]> = {};
  selected.forEach((i) => { (byTime[i.time] = byTime[i.time] || []).push(i); });
  const total = Math.max(...selected.map((i) => i.time));
  const times = Object.keys(byTime).map(Number).sort((a, b) => b - a);
  return times.map((t) => ({
    addAt: total - t,
    duration: t,
    items: byTime[t],
    namesText: byTime[t].map((i) => `${i.name} (${i.note})`).join(', '),
  }));
}

export function useBakePlan(defaultOvenTemp = 400, soundEnabled = true) {
  const [step, setStep] = useState<Step>('home');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<CatFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tempOverride, setTempOverride] = useState<number | null>(null);
  const [prepOverride, setPrepOverride] = useState<number | null>(null);
  const [prepChecked, setPrepChecked] = useState(false);
  const [preheatChecked, setPreheatChecked] = useState(false);
  const [recent, setRecent] = useState<RecentBake[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [timeOverrides, setTimeOverrides] = useState<Record<string, number>>({});
  const [ackedCount, setAckedCount] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [promptIdx, setPromptIdx] = useState<number | null>(null);

  const timerHandle = useRef<number | null>(null);
  const startTs = useRef(0);
  const pausedAt = useRef(0);
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const ackedCountRef = useRef(0);
  const promptIdxRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const setAckedCountBoth = useCallback((v: number) => {
    ackedCountRef.current = v;
    setAckedCount(v);
  }, []);
  const setPromptIdxBoth = useCallback((v: number | null) => {
    promptIdxRef.current = v;
    setPromptIdx(v);
  }, []);
  const setRunningBoth = useCallback((v: boolean) => {
    runningRef.current = v;
    setRunning(v);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerHandle.current != null) {
      clearInterval(timerHandle.current);
      timerHandle.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    try {
      wakeLock.current?.release();
    } catch {
      /* ignore */
    }
    wakeLock.current = null;
  }, []);

  useEffect(() => () => {
    stopTimer();
    releaseWakeLock();
  }, [stopTimer, releaseWakeLock]);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      /* ignore */
    }
  }, []);

  const playChime = useCallback(() => {
    if (soundEnabled === false) return;
    try {
      const ctx = audioCtx.current || (audioCtx.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)());
      [0, 0.22].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.0001;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime + delay;
        gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      /* ignore */
    }
    try {
      navigator.vibrate?.([200, 80, 200]);
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  const effectiveTime = useCallback(
    (id: string) => {
      const ov = timeOverrides[id];
      if (ov != null) return ov;
      return INGREDIENTS.find((i) => i.id === id)?.time ?? 0;
    },
    [timeOverrides],
  );

  const resetTimes = useCallback(() => setTimeOverrides({}), []);

  const adjustIngredientTime = useCallback((id: string, delta: number) => {
    setTimeOverrides((prev) => {
      const current = prev[id] ?? INGREDIENTS.find((i) => i.id === id)?.time ?? 0;
      const v = Math.max(5, Math.min(180, current + delta));
      return { ...prev, [id]: v };
    });
  }, []);

  const getSelected = useCallback(
    (): Ingredient[] =>
      selectedIds
        .map((id) => INGREDIENTS.find((i) => i.id === id))
        .filter((i): i is Ingredient => !!i)
        .map((i) => ({ ...i, time: effectiveTime(i.id) })),
    [selectedIds, effectiveTime],
  );

  const effectiveTemp = useCallback(
    (selected?: Ingredient[]) => {
      const sel = selected ?? getSelected();
      if (tempOverride != null) return tempOverride;
      const rec = modeTemp(sel.map((i) => i.temp));
      return rec ?? defaultOvenTemp;
    },
    [tempOverride, getSelected, defaultOvenTemp],
  );

  const effectivePrep = useCallback(
    () => prepOverride ?? prepSuggestion(selectedIds.length),
    [prepOverride, selectedIds.length],
  );

  const toggleIngredient = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const saveRecent = useCallback(() => {
    const selected = getSelected();
    if (!selected.length) return;
    const ids = [...selectedIds].sort();
    const temp = effectiveTemp(selected);
    const prep = effectivePrep();
    const key = ids.join(',') + '|' + temp;
    setRecent((prev) => {
      let next = prev.filter((r) => r.key !== key);
      next = [
        { key, ids: selectedIds, temp, prep, label: selected.map((i) => i.name).join(', '), savedAt: Date.now() },
        ...next,
      ].slice(0, 6);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [getSelected, selectedIds, effectiveTemp, effectivePrep]);

  const goPlan = useCallback(() => {
    if (!selectedIds.length) return;
    saveRecent();
    setStep('plan');
    setPrepChecked(false);
    setPreheatChecked(false);
  }, [selectedIds.length, saveRecent]);

  const goHome = useCallback(() => setStep('home'), []);

  const loadRecent = useCallback((rb: RecentBake) => {
    setSelectedIds([...rb.ids]);
    setTempOverride(rb.temp);
    setPrepOverride(rb.prep);
  }, []);

  const backToPlan = useCallback(() => setStep('plan'), []);

  const tick = useCallback(() => {
    const groups = computeGroups(getSelected());
    const totalSec = (groups.length ? Math.max(...groups.map((g) => g.addAt + g.duration)) : 0) * 60;
    const elapsed = Math.round((Date.now() - startTs.current) / 1000);

    let promptIdxNow = promptIdxRef.current;
    if (promptIdxNow == null && ackedCountRef.current < groups.length) {
      const nextGroup = groups[ackedCountRef.current];
      if (elapsed >= nextGroup.addAt * 60) {
        promptIdxNow = ackedCountRef.current;
        playChime();
      }
    }

    if (elapsed >= totalSec && promptIdxNow == null) {
      stopTimer();
      releaseWakeLock();
      setStep('done');
      setRunningBoth(false);
      setElapsedSec(totalSec);
      return;
    }

    setElapsedSec(elapsed);
    setPromptIdxBoth(promptIdxNow);
  }, [getSelected, playChime, stopTimer, releaseWakeLock, setPromptIdxBoth, setRunningBoth]);

  const startCooking = useCallback(() => {
    const groups = computeGroups(getSelected());
    if (!groups.length) return;
    setStep('cooking');
    setAckedCountBoth(0);
    setElapsedSec(0);
    setRunningBoth(false);
    setStarted(false);
    setPromptIdxBoth(null);
  }, [getSelected, setAckedCountBoth, setPromptIdxBoth, setRunningBoth]);

  const beginTimer = useCallback(() => {
    startTs.current = Date.now();
    setAckedCountBoth(1);
    setElapsedSec(0);
    setRunningBoth(true);
    setStarted(true);
    setPromptIdxBoth(null);
    requestWakeLock();
    stopTimer();
    timerHandle.current = window.setInterval(tick, 250);
  }, [requestWakeLock, stopTimer, tick, setAckedCountBoth, setPromptIdxBoth, setRunningBoth]);

  const pauseTimer = useCallback(() => {
    if (!runningRef.current) return;
    stopTimer();
    pausedAt.current = Date.now();
    setRunningBoth(false);
  }, [stopTimer, setRunningBoth]);

  const resumeTimer = useCallback(() => {
    if (runningRef.current) return;
    const now = Date.now();
    startTs.current += now - pausedAt.current;
    setRunningBoth(true);
    timerHandle.current = window.setInterval(tick, 250);
  }, [tick, setRunningBoth]);

  const ackPrompt = useCallback(() => {
    const idx = promptIdxRef.current;
    if (idx == null) return;
    setAckedCountBoth(idx + 1);
    setPromptIdxBoth(null);
  }, [setAckedCountBoth, setPromptIdxBoth]);

  const cancelCooking = useCallback(() => {
    stopTimer();
    releaseWakeLock();
    setStep('plan');
    setRunningBoth(false);
  }, [stopTimer, releaseWakeLock, setRunningBoth]);

  const newBake = useCallback(() => {
    setStep('home');
    setSelectedIds([]);
    setTempOverride(null);
    setPrepChecked(false);
    setPreheatChecked(false);
    setAckedCountBoth(0);
    setElapsedSec(0);
    setRunningBoth(false);
    setStarted(false);
    setPromptIdxBoth(null);
  }, [setAckedCountBoth, setPromptIdxBoth, setRunningBoth]);

  const allSelected = useMemo(() => getSelected(), [getSelected]);
  const groups = useMemo(() => computeGroups(allSelected), [allSelected]);
  const totalMin = groups.length ? Math.max(...groups.map((g) => g.addAt + g.duration)) : 0;
  const recTemp = modeTemp(allSelected.map((i) => i.temp)) ?? defaultOvenTemp;
  const temp = effectiveTemp(allSelected);
  const prep = effectivePrep();
  const totalSec = totalMin * 60;

  const filteredIngredients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INGREDIENTS.filter((i) => {
      if (catFilter !== 'all' && i.cat !== catFilter) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, catFilter]);

  const hasTimeOverrides = allSelected.some((i) => timeOverrides[i.id] != null);
  const startDisabled = !(prepChecked && preheatChecked && groups.length > 0);

  const nowInOven = groups.slice(0, ackedCount).flatMap((g) => g.items.map((i) => i.name));
  const pendingGroup = promptIdx != null ? groups[promptIdx] : null;
  const upNext = groups
    .slice(ackedCount)
    .filter((_, i) => !(promptIdx != null && i === 0));
  const nextUnackedIdx = promptIdx != null ? promptIdx + 1 : ackedCount;
  const nextGroup = groups[nextUnackedIdx] || null;
  const nextInLabel = nextGroup ? 'in ' + fmtTime(Math.max(0, nextGroup.addAt * 60 - elapsedSec)) : '';
  const remaining = Math.max(0, totalSec - elapsedSec);
  const ringFrac = totalSec ? Math.min(1, elapsedSec / totalSec) : 0;
  const ringCirc = 2 * Math.PI * 54;
  const ringOffset = ringCirc * (1 - ringFrac);

  return {
    step, search, catFilter, selectedIds, tempOverride, prepChecked, preheatChecked,
    recent, timeOverrides, ackedCount, elapsedSec, running, started, promptIdx,
    setSearch, setCatFilter, setTempOverride, setPrepChecked, setPreheatChecked,
    toggleIngredient, adjustIngredientTime, resetTimes, effectiveTime,
    goPlan, goHome, loadRecent, backToPlan, startCooking, beginTimer, pauseTimer,
    resumeTimer, ackPrompt, cancelCooking, newBake,
    allSelected, groups, totalMin, recTemp, temp, prep, totalSec,
    filteredIngredients, hasTimeOverrides, startDisabled,
    nowInOven, pendingGroup, upNext, nextInLabel, remaining, ringCirc, ringOffset,
    tempOptions: TEMP_OPTIONS,
  };
}
