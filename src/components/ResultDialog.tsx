import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import type { TrainerEngine } from '../engine/TrainerEngine';
import { MistakesList } from './MistakesList';

interface Props { engine: TrainerEngine; onRestart: () => void }

export function ResultDialog({ engine, onRestart }: Props) {
  const { answered, correct, points, newRecord, averageSeconds } = engine;
  return (
    <Dialog open={engine.phase === 'finished'} onClose={() => engine.close()} fullWidth maxWidth="xs">
      <DialogTitle>Тренировка завершена</DialogTitle>
      <DialogContent>
        <Stack spacing={0.5}>
          <Typography>Очки: <b>{points}</b>{newRecord && ' — новый рекорд! 🎉'}</Typography>
          <Typography>Верно: <b>{correct}</b> из {answered}{answered ? ` (${Math.round((correct / answered) * 100)}%)` : ''}</Typography>
          <Typography>Среднее время ответа: <b>{averageSeconds === null ? '—' : `${averageSeconds.toFixed(1)} с`}</b></Typography>
          <Typography sx={{ fontWeight: 600, pt: 1.5 }}>Ошибки{engine.mistakes.length ? ` (${engine.mistakes.length})` : ''}</Typography>
          <MistakesList mistakes={engine.mistakes} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => engine.close()}>Закрыть</Button>
        <Button variant="contained" onClick={onRestart}>Ещё раз</Button>
      </DialogActions>
    </Dialog>
  );
}
