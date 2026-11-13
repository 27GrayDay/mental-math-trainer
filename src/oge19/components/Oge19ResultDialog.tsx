import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import type { StatementsEngine } from '../engine/StatementsEngine';

interface Props { engine: StatementsEngine; onRestart: () => void }

/** Итог тренировки: результат и разбор всех утверждений, в которых были ошибки. */
export function Oge19ResultDialog({ engine, onRestart }: Props) {
  const answered = engine.correct + engine.wrong;
  const mistakes = engine.mistakes;
  return (
    <Dialog open={engine.phase === 'finished'} onClose={() => engine.close()} fullWidth maxWidth="sm">
      <DialogTitle>Тренировка завершена</DialogTitle>
      <DialogContent>
        <Stack spacing={0.5}>
          <Typography>Верно: <b>{engine.correct}</b> из {answered}{answered ? ` (${Math.round((engine.correct / answered) * 100)}%)` : ''}</Typography>
          <Typography>Выучено: <b>{engine.learned}</b> из {engine.totalCount}</Typography>
        </Stack>
        <Typography sx={{ fontWeight: 600, pt: 2, pb: 1 }}>{mistakes.length ? `Над чем стоит поработать (${mistakes.length})` : 'Ошибок не было — отличный результат!'}</Typography>
        <Stack spacing={2}>
          {mistakes.map((s) => (
            <Box key={s.id}>
              <Typography sx={{ fontWeight: 500 }}>{s.text}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: s.answer ? 'var(--green)' : 'var(--red)' }}>{s.answer ? 'Верно' : 'Неверно'}</Typography>
              <Typography sx={{ fontSize: 14, color: 'var(--secondary)' }}>{s.explanation}</Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => engine.close()}>Закрыть</Button>
        <Button variant="contained" onClick={onRestart}>Ещё раз</Button>
      </DialogActions>
    </Dialog>
  );
}
