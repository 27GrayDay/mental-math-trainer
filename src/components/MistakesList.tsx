import { Stack, Typography } from '@mui/material';
import { COLORS } from '../constants';
import { formatNumber, questionToText } from '../domain';
import type { HistoryEntry } from '../types';

/** Список ошибок: пример, верный ответ и то, что ввёл ученик. */
export function MistakesList({ mistakes }: { mistakes: HistoryEntry[] }) {
  if (!mistakes.length) return <Typography sx={{ color: 'var(--secondary)' }}>Ошибок нет — отличный результат!</Typography>;
  return (
    <Stack spacing={0.75}>
      {mistakes.map(({ question, given }, i) => (
        <Typography key={i} sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {questionToText(question)} = <b>{formatNumber(question.answer)}</b>{' '}
          <span style={{ fontSize: 14, color: COLORS.danger }}>{given ? `(ваш ответ: ${formatNumber(given)})` : '(нет ответа)'}</span>
        </Typography>
      ))}
    </Stack>
  );
}
