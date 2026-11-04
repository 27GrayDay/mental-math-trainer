import { Box } from '@mui/material';

/** Тонкая скруглённая шкала; value — от 0 до 1. */
export function ProgressTrack({ value, color }: { value: number; color: string }) {
  return (
    <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'var(--fill)', overflow: 'hidden' }}>
      <Box sx={{ height: '100%', width: `${Math.max(0, Math.min(1, value)) * 100}%`, bgcolor: color, borderRadius: 2 }} />
    </Box>
  );
}
