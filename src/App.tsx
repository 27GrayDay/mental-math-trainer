import { Box } from '@mui/material';
import { Footer } from './components/Footer';
import { ModeSwitcher, type Mode } from './components/ModeSwitcher';
import { usePersistentState } from './hooks/usePersistentState';
import { useTrainer } from './hooks/useTrainer';
import { Oge19Screen } from './oge19/Oge19Screen';
import { useStatements } from './oge19/hooks/useStatements';
import { CalcScreen } from './screens/CalcScreen';

/** Оболочка: переключатель режимов и выбранный экран. Движки живут здесь, поэтому при смене режима ничего не теряется. */
export default function App() {
  const calc = useTrainer();
  const oge = useStatements();
  const [mode, setMode] = usePersistentState<Mode>('mm:mode', 'calc');

  const changeMode = (next: Mode) => {
    if (next !== 'calc') calc.pause(); // таймеры счёта не должны идти, пока открыт другой режим
    setMode(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <Box sx={{ pb: 2 }}>
      <ModeSwitcher mode={mode} onChange={changeMode} />
      {mode === 'oge19' ? <Oge19Screen engine={oge} /> : <CalcScreen engine={calc} />}
      <Footer />
    </Box>
  );
}
