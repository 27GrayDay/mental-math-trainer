import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Footer } from './components/Footer';
import { Instructions } from './components/Instructions';
import { Keypad } from './components/Keypad';
import { QuestionBoard } from './components/QuestionBoard';
import { ResultDialog } from './components/ResultDialog';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { StatsBar, StatsCard } from './components/Stats';
import { useHotkeys } from './hooks/useHotkeys';
import { useSettings } from './hooks/useSettings';
import { useTrainer } from './hooks/useTrainer';
import { hasEnabledOps } from './domain';
import type { Settings } from './types';

const COLUMN = 680; // ширина центральной колонки на больших экранах

export default function App() {
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const [settings, updateSettings] = useSettings();
  const engine = useTrainer();
  useHotkeys(engine);

  const change = (patch: Partial<Settings>) => {
    updateSettings(patch);
    if (patch.sound !== undefined) engine.setSound(patch.sound); // звук меняется и во время тренировки
  };
  const start = () => {
    (document.activeElement as HTMLElement | null)?.blur(); // чтобы пробел не нажимал кнопку
    engine.start(settings);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // к примеру
  };

  const board = <QuestionBoard engine={engine} mobile={mobile} keyboardVisible={settings.keyboard} />;
  const keypad = settings.keyboard && <Keypad disabled={!engine.canType} onPress={(k) => engine.press(k)} />;
  const lower = (
    <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', p: { xs: 1.5, md: 0 }, pt: { md: 4 } }}>
      <SettingsPanel settings={settings} canStart={hasEnabledOps(settings)} onChange={change} onStart={start} />
      <Instructions />
    </Stack>
  );

  return (
    <Box sx={{ pb: 2 }}>
      {mobile ? (
        // Первый экран ровно по высоте окна: пример сверху, клавиатура внизу и видна целиком
        <Box sx={{ height: '100vh', '@supports (height: 100dvh)': { height: '100dvh' }, display: 'flex', flexDirection: 'column' }}>
          <StatsBar engine={engine} />
          <Box sx={{ flex: 1, minHeight: 0, p: 1.5, display: 'flex', flexDirection: 'column' }}>{board}</Box>
          {keypad}
        </Box>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', pt: 3 }}>
          <StatsCard engine={engine} />
          {board}
          {keypad}
        </Stack>
      )}
      {lower}
      <Footer />
      <ResultDialog engine={engine} onRestart={() => { engine.close(); start(); }} />
    </Box>
  );
}
