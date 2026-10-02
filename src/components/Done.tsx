import type { useBakePlan } from '../useBakePlan';
import { CheckIcon } from '../icons';

type VM = ReturnType<typeof useBakePlan>;

export default function Done({ vm }: { vm: VM }) {
  const itemsText = vm.allSelected.map((i) => i.name).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 'var(--space-6)', textAlign: 'center', gap: 'var(--space-4)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-accent-2-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckIcon size={30} color="#3d472b" />
      </div>
      <h2 style={{ margin: 0 }}>Bake's done!</h2>
      <p style={{ margin: 0, opacity: 0.7, fontSize: 14, maxWidth: 280 }}>
        {itemsText} · {vm.temp}°F · {vm.totalMin} min total
      </p>
      <button type="button" className="btn btn-primary btn-block" onClick={vm.newBake} style={{ maxWidth: 260 }}>
        Start a new bake
      </button>
    </div>
  );
}
