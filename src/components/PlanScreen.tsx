import type { useBakePlan } from '../useBakePlan';
import { ArrowLeftIcon, ArrowRightIcon } from '../icons';

type VM = ReturnType<typeof useBakePlan>;

export default function PlanScreen({ vm }: { vm: VM }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-4) var(--space-2)' }}>
        <button type="button" className="btn btn-ghost btn-icon" onClick={vm.goHome} aria-label="Back" style={{ color: '#000' }}>
          <ArrowLeftIcon />
        </button>
        <h2 style={{ margin: 0, fontSize: 22 }}>Your bake plan</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-4) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <span className="tag tag-outline">{vm.totalMin} min total</span>
          <span className="tag tag-outline">{vm.temp}°F</span>
          <span className="tag tag-outline">{vm.prep} min prep</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--space-4)' }}>
          {vm.groups.map((g, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flex: 'none' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: g.items[0].color, flex: 'none' }} />
                <div style={{ width: 2, flex: 1, background: 'var(--color-divider)', marginTop: 2 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {g.addAt === 0 ? 'Start' : `at +${g.addAt} min`}
                </div>
                <div className="card-title" style={{ fontSize: 17, margin: '2px 0 2px' }}>{g.namesText}</div>
                <div style={{ fontSize: 12, opacity: 0.65 }}>cooks {g.duration} min</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div className="card-kicker" style={{ color: '#000', marginBottom: 'var(--space-2)' }}>Before you start cooking</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <label
              className="radio"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: 'var(--space-3)', borderRadius: 8,
                background: vm.prepChecked ? 'var(--color-accent-100)' : '#fff',
                border: vm.prepChecked ? '2px solid var(--color-accent)' : '1px solid var(--color-divider)',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={vm.prepChecked} onChange={() => vm.setPrepChecked((v) => !v)} />
              <span className="dot" style={{ marginTop: 3 }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Prep done</span>
                <span style={{ fontWeight: 400, opacity: 0.65, fontSize: 12 }}>{vm.prep} min of chopping etc.</span>
              </span>
            </label>
            <label
              className="radio"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: 'var(--space-3)', borderRadius: 8,
                background: vm.preheatChecked ? 'var(--color-accent-100)' : '#fff',
                border: vm.preheatChecked ? '2px solid var(--color-accent)' : '1px solid var(--color-divider)',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={vm.preheatChecked} onChange={() => vm.setPreheatChecked((v) => !v)} />
              <span className="dot" style={{ marginTop: 3 }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Oven preheated</span>
                <span style={{ fontWeight: 400, opacity: 0.65, fontSize: 12 }}>to {vm.temp}°F</span>
              </span>
            </label>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={vm.startDisabled}
          onClick={vm.startCooking}
          style={{ fontSize: 15, padding: 12, background: '#333333' }}
        >
          Start cooking
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
