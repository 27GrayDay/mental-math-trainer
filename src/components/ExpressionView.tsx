import { Typography } from '@mui/material';
import { COLORS } from '../constants';
import { formatNumber } from '../domain';
import type { TrainerEngine } from '../engine/TrainerEngine';

/** Пример крупным лёгким шрифтом: числа синее, оранжевое, бирюзовое; после «=» — то, что вводит ученик. */
export function ExpressionView({ engine }: { engine: TrainerEngine }) {
  const q = engine.question;
  if (!engine.isActive || !q) {
    return <Typography sx={{ color: 'var(--secondary)', pt: 1 }}>Выберите режимы в настройках</Typography>;
  }
  return (
    <Typography component="div" sx={{ fontSize: 'clamp(40px, 9vw, 76px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', wordBreak: 'keep-all' }}>
      {q.tokens.map((t, i) => <span key={i} style={{ color: COLORS[t.kind], margin: '0 .12em' }}>{t.text}</span>)}
      <span style={{ color: COLORS.operator, margin: '0 .12em' }}>=</span>
      <span style={{ color: engine.input ? 'var(--label)' : 'var(--secondary)' }}>{engine.input ? formatNumber(engine.input) : '?'}</span>
    </Typography>
  );
}
