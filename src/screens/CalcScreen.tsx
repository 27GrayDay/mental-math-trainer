import { Stack, Box, useMediaQuery, useTheme } from '@mui/material';
import { Instructions } from '../components/Instructions';
import { Keypad } from '../components/Keypad';
import { QuestionBoard } from '../components/QuestionBoard';
import { ResultDialog } from '../components/ResultDialog';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { StatsBar, StatsCard, type Metric } from '../components/Stats';
import { COLUMN, heroSx } from '../components/ui/layout';
import { COLORS } from '../constants';
import { hasEnabledOps } from '../domain';
import type { TrainerEngine } from '../engine/TrainerEngine';
import { useHotkeys } from '../hooks/useHotkeys';
import { useSettings } from '../hooks/useSettings';
import type { Settings } from '../types';

/** Режим «Устный счёт». Движок создаётся в App, чтобы тренировка не терялась при смене режима. */
export function CalcScreen({ engine }: { engine: TrainerEngine }) {
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const [settings, updateSettings] = useSettings();
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

  const metrics: Metric[] = [
    { label: 'Очки', value: engine.points, color: 'var(--label)' },
    { label: 'Верно', value: engine.correct, color: COLORS.success },
    { label: 'Множитель', value: `×${engine.multiplier}`, color: COLORS.primary },
    { label: 'Рекорд', value: engine.record, color: COLORS.warning },
  ];
  const board = <QuestionBoard engine={engine} mobile={mobile} keyboardVisible={settings.keyboard} />;
  const keypad = settings.keyboard && <Keypad disabled={!engine.canType} onPress={(k) => engine.press(k)} />;

  return (
    <>
      {mobile ? (
        // Первый экран ровно по высоте окна: пример сверху, клавиатура внизу и видна целиком
        <Box sx={heroSx}>
          <StatsBar metrics={metrics} />
          <Box sx={{ flex: 1, minHeight: 0, p: 1.5, display: 'flex', flexDirection: 'column' }}>{board}</Box>
          {keypad}
        </Box>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', pt: 1 }}>
          <StatsCard metrics={metrics} />
          {board}
          {keypad}
        </Stack>
      )}
      <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', p: { xs: 1.5, md: 0 }, pt: { md: 4 } }}>
        <SettingsPanel settings={settings} canStart={hasEnabledOps(settings)} onChange={change} onStart={start} />
        <Instructions />
      </Stack>
      <ResultDialog engine={engine} onRestart={() => { engine.close(); start(); }} />
    </>
  );
}
