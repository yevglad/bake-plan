import { useBakePlan } from './useBakePlan';
import Home from './components/Home';
import PlanScreen from './components/PlanScreen';
import Cooking from './components/Cooking';
import Done from './components/Done';

function App() {
  const vm = useBakePlan();

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
      }}
    >
      {vm.step === 'home' && <Home vm={vm} />}
      {vm.step === 'plan' && <PlanScreen vm={vm} />}
      {vm.step === 'cooking' && <Cooking vm={vm} />}
      {vm.step === 'done' && <Done vm={vm} />}
    </div>
  );
}

export default App;
