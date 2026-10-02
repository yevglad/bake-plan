import type { useBakePlan, CatFilter } from '../useBakePlan';
import type { Ingredient } from '../ingredients';
import { SearchIcon, MinusIcon, PlusIcon, CheckIcon, CloseIcon, ArrowRightIcon } from '../icons';

type VM = ReturnType<typeof useBakePlan>;

function darkColor(color: string) {
  return `color-mix(in oklch, ${color} 55%, black)`;
}

export default function Home({ vm }: { vm: VM }) {
  const selectedSet = new Set(vm.selectedIds);

  const catOptions: { value: CatFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'veg', label: 'Vegetables' },
    { value: 'protein', label: 'Proteins' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: 'var(--space-4) var(--space-4) var(--space-2)' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 2px' }}>Baking timer</h1>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.65 }}>One bake perfectly timed</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-4) 160px' }}>
        {vm.recent.length > 0 && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h6 style={{ margin: '0 0 var(--space-2)', opacity: 0.6 }}>Recent bakes</h6>
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 4 }}>
              {vm.recent.map((rb) => (
                <div
                  key={rb.key}
                  className="card elev-sm"
                  onClick={() => vm.loadRecent(rb)}
                  style={{ cursor: 'pointer', flex: '0 0 auto', minWidth: 170, maxWidth: 210, background: '#fff' }}
                >
                  <div className="card-title" style={{ fontSize: 14, lineHeight: 1.3 }}>{rb.label}</div>
                  <span className="tag tag-outline" style={{ alignSelf: 'flex-start' }}>{rb.temp}°F</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
          <input
            className="input"
            type="text"
            placeholder="Search ingredients"
            value={vm.search}
            onChange={(e) => vm.setSearch(e.target.value)}
            style={{ paddingLeft: 36, background: '#fff' }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex' }}>
            <SearchIcon />
          </span>
        </div>

        <div className="seg" style={{ marginBottom: 'var(--space-3)', width: '100%' }}>
          {catOptions.map((opt) => (
            <label
              key={opt.value}
              className="seg-opt"
              style={{ flex: 1, justifyContent: 'center', ...(vm.catFilter === opt.value ? { background: '#e6e6e6', color: 'var(--color-text)' } : {}) }}
            >
              <input type="radio" name="cat" checked={vm.catFilter === opt.value} onChange={() => vm.setCatFilter(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)' }}>
          {vm.filteredIngredients.map((ing: Ingredient) => {
            const selected = selectedSet.has(ing.id);
            const time = vm.effectiveTime(ing.id);
            const dColor = darkColor(ing.color);
            return (
              <div
                key={ing.id}
                onClick={() => vm.toggleIngredient(ing.id)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer',
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                  background: ing.color,
                  border: selected ? `2px solid ${dColor}` : '1px solid var(--color-divider)',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25 }}>{ing.name} - {ing.note}</div>
                <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => vm.adjustIngredientTime(ing.id, -5)}
                      aria-label="Decrease time by 5 minutes"
                      style={{ width: 44, height: 44, flex: 'none', padding: 0, borderRadius: '50%', border: '1px solid var(--color-divider)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <MinusIcon />
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#000', minWidth: 56, textAlign: 'center' }}>{time} min</span>
                    <button
                      type="button"
                      onClick={() => vm.adjustIngredientTime(ing.id, 5)}
                      aria-label="Increase time by 5 minutes"
                      style={{ width: 44, height: 44, flex: 'none', padding: 0, borderRadius: '50%', border: '1px solid var(--color-divider)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  {selected ? (
                    <div style={{ width: 44, height: 44, flex: 'none', borderRadius: '50%', background: dColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </div>
                  ) : (
                    <div style={{ width: 44, height: 44, flex: 'none', borderRadius: '50%', border: `2px solid ${dColor}`, background: '#fff' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {vm.filteredIngredients.length === 0 && (
          <p style={{ opacity: 0.5, fontSize: 13, textAlign: 'center', padding: 'var(--space-6) 0' }}>No ingredients match your search.</p>
        )}
      </div>

      {vm.allSelected.length > 0 && (
        <div
          style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, zIndex: 10,
            borderTop: '1px solid var(--color-divider)', background: '#f8f8f8',
            padding: 'var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            boxShadow: '0 -4px 16px rgba(0,0,0,.08)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {vm.allSelected.map((sel) => (
              <span
                key={sel.id}
                className="tag"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', background: sel.color, color: 'var(--color-text)' }}
                onClick={() => vm.toggleIngredient(sel.id)}
              >
                {sel.name}
                <CloseIcon />
              </span>
            ))}
          </div>

          {vm.hasTimeOverrides && (
            <button type="button" className="btn btn-ghost" onClick={vm.resetTimes} style={{ padding: 0, alignSelf: 'flex-end', fontSize: 12, color: '#000' }}>
              Reset times to default
            </button>
          )}

          <div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 5 }}>Oven temp — recommended {vm.recTemp}°F</div>
            <div className="seg" style={{ width: '100%' }}>
              {vm.tempOptions.map((t) => (
                <label
                  key={t}
                  className="seg-opt"
                  style={{ flex: 1, justifyContent: 'center', ...(vm.temp === t ? { background: '#333333', color: '#fff' } : {}) }}
                >
                  <input type="radio" name="temp" checked={vm.temp === t} onChange={() => vm.setTempOverride(t)} />
                  {t}°
                </label>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-block" onClick={vm.goPlan} style={{ fontSize: 15, padding: 12, background: '#333333' }}>
            Plan the bake
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
