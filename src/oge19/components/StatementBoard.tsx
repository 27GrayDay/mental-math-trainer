import { Box, Typography } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Card } from '../../components/ui/Card';
import { ProgressTrack } from '../../components/ui/ProgressTrack';
import type { StatementsEngine } from '../engine/StatementsEngine';
import { Figure } from './Figure';

const caption = { fontSize: 13, color: 'var(--secondary)', mb: 0.75 } as const;

/** Карточка с утверждением; после ответа под ним появляется разбор. */
export function StatementBoard({ engine, mobile }: { engine: StatementsEngine; mobile: boolean }) {
  const s = engine.current;
  const answered = engine.phase === 'answered';
  const ok = engine.lastCorrect;
  return (
    <Card sx={{ p: 0, borderRadius: '28px', display: 'flex', flexDirection: 'column', flex: mobile ? 1 : undefined, minHeight: 0 }}>
      <Box sx={{ px: 3, pt: 2.5 }}><ProgressTrack value={engine.sessionProgress} color="var(--blue)" /></Box>
      <Box sx={{ flex: 1, minHeight: mobile ? 0 : 380, overflowY: 'auto', px: 3, py: 3 }}>
        {s && engine.isActive ? (
          <Box key={s.id}>
            <Typography sx={caption}>Утверждение</Typography>
            <Typography sx={{ fontSize: 'clamp(21px, 5vw, 28px)', fontWeight: 500, lineHeight: 1.3 }}>{s.text}</Typography>
            {answered && (
              <Box sx={{ mt: 3, pt: 2.5, borderTop: '0.5px solid var(--separator)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: ok ? 'var(--green)' : 'var(--red)' }}>
                  {ok ? <CheckCircle /> : <Cancel />}
                  <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{ok ? 'Верно!' : 'Неверно'}</Typography>
                </Box>
                <Typography sx={{ mt: 0.5, color: 'var(--secondary)' }}>Это утверждение {s.answer ? 'верное' : 'неверное'}.</Typography>
                <Typography sx={{ ...caption, mt: 2.5, mb: 0.5 }}>Разбор</Typography>
                <Typography sx={{ fontSize: 17, lineHeight: 1.45 }}>{s.explanation}</Typography>
                {s.figure && <Figure key={s.figure} file={s.figure} />}
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', color: 'var(--secondary)', pt: { md: 8 } }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: 'var(--label)', mb: 1 }}>Задание 19 ОГЭ</Typography>
            <Typography>
              {engine.phase === 'finished'
                ? 'Тренировка завершена. Запустите новую в настройках ниже.'
                : 'Определите, верно ли утверждение. После ответа появится разбор.'}
            </Typography>
            <Typography sx={{ mt: 1.5 }}>Выучено: {engine.learned} из {engine.totalCount}</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
