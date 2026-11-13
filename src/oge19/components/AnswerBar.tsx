import { Box, Button, type ButtonProps } from '@mui/material';
import type { StatementsEngine } from '../engine/StatementsEngine';

const big: ButtonProps['sx'] = { flex: 1, height: 64, borderRadius: '20px', fontSize: 20, fontWeight: 600 };
const tint = (color: string) => ({ ...big, color: `var(--${color})`, bgcolor: `color-mix(in srgb, var(--${color}) 15%, transparent)`, '&:hover': { bgcolor: `color-mix(in srgb, var(--${color}) 24%, transparent)` } });

/** «Неверно | Верно» до ответа и «Дальше» после него. Высота зарезервирована, чтобы страница не прыгала. */
export function AnswerBar({ engine }: { engine: StatementsEngine }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, minHeight: 64, px: { xs: 1.5, md: 0 }, pt: { xs: 1, md: 0 }, pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', md: 0 } }}>
      {engine.phase === 'question' && (
        <>
          <Button sx={tint('red')} onClick={() => engine.answer(false)}>Неверно</Button>
          <Button sx={tint('green')} onClick={() => engine.answer(true)}>Верно</Button>
        </>
      )}
      {engine.phase === 'answered' && (
        <Button variant="contained" sx={{ ...big, bgcolor: 'var(--blue)' }} onClick={() => engine.next()}>
          {engine.isLast ? 'Завершить' : 'Дальше'}
        </Button>
      )}
    </Box>
  );
}
