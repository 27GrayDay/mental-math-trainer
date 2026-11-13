import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { StatsBar, StatsCard, type Metric } from '../components/Stats';
import { COLUMN, heroSx } from '../components/ui/layout';
import { COLORS } from '../constants';
import { usePersistentState } from '../hooks/usePersistentState';
import { AnswerBar } from './components/AnswerBar';
import { Oge19Instructions } from './components/Oge19Instructions';
import { Oge19ResultDialog } from './components/Oge19ResultDialog';
import { Oge19Settings } from './components/Oge19Settings';
import { StatementBoard } from './components/StatementBoard';
import { DEFAULT_OGE_SETTINGS } from './constants';
import type { StatementsEngine } from './engine/StatementsEngine';
import { useStatementHotkeys } from './hooks/useStatementHotkeys';
import type { Oge19Settings as Settings } from './types';

/** Режим «ОГЭ № 19»: верно или неверно утверждение + разбор. Движок создаётся в App. */
export function Oge19Screen({ engine }: { engine: StatementsEngine }) {
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const [settings, setSettings] = usePersistentState<Settings>('mm:oge19:settings', DEFAULT_OGE_SETTINGS);
  useStatementHotkeys(engine);

  const change = (patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    if (patch.sound !== undefined) engine.setSound(patch.sound);
  };
  const start = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    if (engine.start(settings)) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const metrics: Metric[] = [
    { label: 'Верно', value: engine.correct, color: COLORS.success },
    { label: 'Ошибки', value: engine.wrong, color: COLORS.danger },
    { label: 'Серия', value: engine.streak, color: COLORS.primary },
    { label: 'Выучено', value: `${engine.learned}/${engine.totalCount}`, color: COLORS.warning },
  ];
  const board = <StatementBoard engine={engine} mobile={mobile} />;

  return (
    <>
      {mobile ? (
        <Box sx={heroSx}>
          <StatsBar metrics={metrics} />
          <Box sx={{ flex: 1, minHeight: 0, p: 1.5, pb: 0, display: 'flex', flexDirection: 'column' }}>{board}</Box>
          <AnswerBar engine={engine} />
        </Box>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', pt: 1 }}>
          <StatsCard metrics={metrics} />
          {board}
          <AnswerBar engine={engine} />
        </Stack>
      )}
      <Stack spacing={2} sx={{ maxWidth: COLUMN, mx: 'auto', p: { xs: 1.5, md: 0 }, pt: { md: 4 } }}>
        <Oge19Settings settings={settings} engine={engine} onChange={change} onStart={start} />
        <Oge19Instructions />
      </Stack>
      <Oge19ResultDialog engine={engine} onRestart={() => { engine.close(); start(); }} />
    </>
  );
}
