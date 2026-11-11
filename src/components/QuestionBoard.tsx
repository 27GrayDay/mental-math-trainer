import { Box, Button, Typography } from '@mui/material';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import type { TrainerEngine } from '../engine/TrainerEngine';
import { ExpressionView } from './ExpressionView';
import { HistoryList } from './HistoryList';
import { Card } from './ui/Card';
import { ProgressTrack } from './ui/ProgressTrack';

interface Props { engine: TrainerEngine; mobile: boolean; keyboardVisible: boolean }

const link = { fontWeight: 500, color: 'var(--blue)' } as const;

/** Пример и история. Верхняя шкала — время на вопрос, нижняя — время тренировки. */
export function QuestionBoard({ engine, mobile, keyboardVisible }: Props) {
  const paused = engine.isPaused;
  return (
    <Card sx={{ p: 0, borderRadius: '28px', display: 'flex', flexDirection: 'column', flex: mobile ? 1 : undefined, minHeight: 0 }}>
      <Box sx={{ px: 3, pt: 2.5 }}><ProgressTrack value={engine.questionProgress} color="var(--blue)" /></Box>
      <Box sx={{ flex: 1, minHeight: mobile ? 0 : 380, overflow: 'hidden', px: 3, pt: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' } }}>
        {paused ? (
          <Box sx={{ alignSelf: 'center', my: 'auto', textAlign: 'center' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 600, mb: 2 }}>Пауза</Typography>
            <Button variant="contained" startIcon={<PlayArrow />} onClick={() => engine.resume()} sx={{ borderRadius: '999px', px: 3, bgcolor: 'var(--blue)' }}>Продолжить</Button>
          </Box>
        ) : (
          <>
            <ExpressionView engine={engine} />
            {engine.isActive && <HistoryList entries={engine.history} />}
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pb: 1 }}>
        <Button disabled={!engine.isActive} startIcon={paused ? <PlayArrow /> : <Pause />} onClick={() => engine.togglePause()} sx={link}>
          {paused ? 'Продолжить' : 'Пауза'}
        </Button>
        {keyboardVisible
          ? <Box sx={{ flex: 1 }} />
          : <Typography sx={{ flex: 1, fontSize: 12, textAlign: 'center', color: 'var(--secondary)' }}>Цифры — ввод, пробел — показать ответ, Esc — пауза</Typography>}
        <Button disabled={engine.phase !== 'running'} onClick={() => engine.dontKnow()} sx={link}>Не знаю</Button>
      </Box>
      <Box sx={{ px: 3, pb: 2.5 }}><ProgressTrack value={engine.sessionProgress} color="var(--green)" /></Box>
    </Card>
  );
}
