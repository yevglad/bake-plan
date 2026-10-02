import type { useBakePlan } from '../useBakePlan';
import { fmtTime } from '../useBakePlan';
import { ArrowLeftIcon } from '../icons';

type VM = ReturnType<typeof useBakePlan>;

export default function Cooking({ vm }: { vm: VM }) {
  const remainingCaption = vm.started ? (vm.running ? 'Time remaining' : 'Time remaining - Paused') : 'Total time';
  const remainingLabel = fmtTime(vm.remaining);
  const nowInOvenText = vm.started ? vm.nowInOven.join(', ') : 'Nothing in oven, tap start timer';
  const pendingText = vm.pendingGroup ? vm.pendingGroup.namesText : '';
  const pendingAreIs = vm.pendingGroup && vm.pendingGroup.items.length === 1 ? 'is' : 'are';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: 'var(--space-4) var(--space-4) 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', gap: 'var(--space-2)' }}>
          {vm.started ? (
            <button type="button" className="btn btn-ghost" onClick={vm.cancelCooking} style={{ paddingInline: 0, color: '#000' }}>
              End bake
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={vm.backToPlan} style={{ paddingInline: 0, color: '#000', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeftIcon size={15} />
              Back to plan
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'auto' }}>
            <span className="tag tag-outline">{vm.temp}°F</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {!vm.started && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 2 }}>{remainingCaption}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 52, lineHeight: 1 }}>{remainingLabel}</div>
          </div>
        )}
        {vm.started && (
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
            <svg width="200" height="200" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-neutral-300)" strokeWidth={8} />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="var(--color-accent)" strokeWidth={8}
                strokeLinecap="round"
                style={{ strokeDasharray: `${vm.ringCirc} ${vm.ringCirc}`, strokeDashoffset: vm.ringOffset, transition: 'stroke-dashoffset .4s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 2 }}>{remainingCaption}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 34, lineHeight: 1 }}>{remainingLabel}</div>
            </div>
          </div>
        )}

        {!vm.started && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={vm.beginTimer}
            style={{ fontSize: 14, padding: '9px 20px', background: '#333333', color: '#fff', margin: '-16px auto 0', alignSelf: 'center' }}
          >
            Start timer
          </button>
        )}
        {vm.started && vm.running && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={vm.pauseTimer}
            style={{ fontSize: 14, padding: '9px 20px', margin: '-16px auto 0', alignSelf: 'center' }}
          >
            Pause
          </button>
        )}
        {vm.started && !vm.running && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={vm.resumeTimer}
            style={{ fontSize: 14, padding: '9px 20px', background: '#333333', color: '#fff', margin: '-16px auto 0', alignSelf: 'center' }}
          >
            Resume timer
          </button>
        )}

        <div className="card elev-sm" style={{ background: '#fff', border: '3px solid var(--color-accent)' }}>
          <div className="card-kicker" style={{ color: '#000' }}>Now in the oven</div>
          <div className="card-title" style={{ fontSize: 16 }}>{nowInOvenText}</div>
          {vm.pendingGroup && (
            <div style={{ borderTop: '1px solid var(--color-divider)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Confirm {pendingText} {pendingAreIs} in the oven</div>
              <button type="button" className="btn btn-primary btn-block" onClick={vm.ackPrompt}>Yes</button>
            </div>
          )}
        </div>

        {vm.upNext.length > 0 && (
          <div>
            <h6 style={{ color: '#000', opacity: 1, margin: '0 0 var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Up next
              <span style={{ fontWeight: 700, color: '#000' }}>{vm.nextInLabel}</span>
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {vm.upNext.map((u, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8a8a8a', marginBottom: 6 }}>
                    {u.addAt === 0 ? 'Starting now' : `At +${u.addAt} min mark`}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {u.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 12px', borderRadius: 8, background: item.color }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name} ({item.note})</span>
                        <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, flex: 'none' }}>{item.time} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
