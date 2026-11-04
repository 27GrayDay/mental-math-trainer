import { Box, Typography } from '@mui/material';
import { COLORS } from '../constants';
import type { TrainerEngine } from '../engine/TrainerEngine';
import { Card } from './ui/Card';

const metrics = (e: TrainerEngine) => [
  { label: 'Очки', value: e.points, color: 'var(--label)' },
  { label: 'Верно', value: e.correct, color: COLORS.success },
  { label: 'Множитель', value: `×${e.multiplier}`, color: COLORS.primary },
  { label: 'Рекорд', value: e.record, color: COLORS.warning },
];

/** Прозрачная «стеклянная» панель, закреплённая сверху (телефон). */
export function StatsBar({ engine }: { engine: TrainerEngine }) {
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-around', pt: 'calc(env(safe-area-inset-top, 0px) + 8px)', pb: 1, bgcolor: 'var(--glass)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '0.5px solid var(--separator)' }}>
      {metrics(engine).map((m) => (
        <Box key={m.label} sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 11, color: 'var(--secondary)' }}>{m.label}</Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Карточка со статистикой над примером (десктоп): четыре показателя в ряд. */
export function StatsCard({ engine }: { engine: TrainerEngine }) {
  return (
    <Card sx={{ display: 'flex', py: 1.75, px: 0 }}>
      {metrics(engine).map((m, i) => (
        <Box key={m.label} sx={{ flex: 1, textAlign: 'center', borderLeft: i ? '0.5px solid var(--separator)' : 'none' }}>
          <Typography sx={{ fontSize: 13, color: 'var(--secondary)' }}>{m.label}</Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 600, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{m.value}</Typography>
        </Box>
      ))}
    </Card>
  );
}
