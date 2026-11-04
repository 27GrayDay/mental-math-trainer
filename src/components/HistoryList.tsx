import { Stack, Typography } from '@mui/material';
import { COLORS, TRAINER } from '../constants';
import { formatNumber, questionToText } from '../domain';
import type { HistoryEntry } from '../types';

/** История под примером: новые сверху. Верные — зелёным, ошибки — серым, с зачёркнутым неверным вводом. */
export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  const shown = entries.slice(-TRAINER.historyVisible).reverse();
  return (
    <Stack spacing={0.5} sx={{ mt: 3, alignItems: { xs: 'flex-start', md: 'center' } }}>
      {shown.map((e, i) => (
        <Typography key={entries.length - i} sx={{ fontSize: { xs: 19, md: 22 }, fontVariantNumeric: 'tabular-nums', color: e.correct ? COLORS.success : 'var(--secondary)', opacity: 1 - i * 0.15 }}>
          {questionToText(e.question)} = {formatNumber(e.question.answer)}
          {!e.correct && e.given && <s style={{ color: COLORS.danger, marginLeft: '0.5em' }}>{formatNumber(e.given)}</s>}
        </Typography>
      ))}
    </Stack>
  );
}
