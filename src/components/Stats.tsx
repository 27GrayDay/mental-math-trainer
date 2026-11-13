import { Box, Typography } from '@mui/material';
import { Card } from './ui/Card';

export interface Metric { label: string; value: string | number; color: string }

/** Прозрачная «стеклянная» панель, закреплённая сверху (телефон). */
export function StatsBar({ metrics }: { metrics: Metric[] }) {
  return (
    <Box sx={{ position: 'sticky', top: 'env(safe-area-inset-top, 0px)', zIndex: 10, display: 'flex', justifyContent: 'space-around', pt: 1, pb: 1, bgcolor: 'var(--glass)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '0.5px solid var(--separator)' }}>
      {metrics.map((m) => (
        <Box key={m.label} sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 11, color: 'var(--secondary)' }}>{m.label}</Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Карточка со статистикой над основным блоком (десктоп): показатели в ряд. */
export function StatsCard({ metrics }: { metrics: Metric[] }) {
  return (
    <Card sx={{ display: 'flex', py: 1.75, px: 0 }}>
      {metrics.map((m, i) => (
        <Box key={m.label} sx={{ flex: 1, textAlign: 'center', borderLeft: i ? '0.5px solid var(--separator)' : 'none' }}>
          <Typography sx={{ fontSize: 13, color: 'var(--secondary)' }}>{m.label}</Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 600, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{m.value}</Typography>
        </Box>
      ))}
    </Card>
  );
}
