import type { Question, Token } from '../types';
import { evaluate } from './evaluate';
import { formatNumber, SYMBOLS } from './format';
import { maybeNegate, randInt } from './random';

const TABLE_MAX = 10; // табличные множители 2…10

/** Диапазон i-го операнда с учётом соседних действий. */
function operandRange(prev: string | undefined, next: string | undefined, max: number): [number, number] {
  if (prev === '*' || next === '*' || prev === '/') return [2, Math.min(TABLE_MAX, max)];
  return [1, max];
}

function pickNumbers(ops: string[], max: number, negatives: boolean): number[] | null {
  if (ops.length === 1 && ops[0] === '/') { // деление строим от ответа, чтобы делилось нацело
    const divisor = randInt(2, TABLE_MAX), maxQuotient = Math.floor(max / divisor);
    return maxQuotient < 2 ? null : [divisor * randInt(2, maxQuotient), divisor];
  }
  const nums: number[] = [];
  for (let i = 0; i <= ops.length; i++) {
    const [lo, hi] = operandRange(ops[i - 1], ops[i], max);
    const v = randInt(lo, hi);
    nums.push(negatives ? maybeNegate(v) : v);
  }
  return nums;
}

const toTokens = (nums: number[], ops: string[]): Token[] =>
  nums.flatMap((v, i): Token[] => [
    ...(i ? [{ text: SYMBOLS[ops[i - 1]], kind: 'operator' as const }] : []),
    { text: i && v < 0 ? `(${formatNumber(v)})` : formatNumber(v), kind: (['first', 'second', 'third'] as const)[i] },
  ]);

/** Ключ для поиска повторов: a+b и b+a — один и тот же пример. */
function questionKey(nums: number[], ops: string[]): string {
  if (ops.length === 1 && (ops[0] === '+' || ops[0] === '*')) return [...nums].sort((a, b) => a - b).join(ops[0]);
  return nums.reduce((acc, n, i) => acc + (i ? ops[i - 1] : '') + n, '');
}

/** Одна попытка построить цепочку чисел и действий (+ − × ÷); null — не получилось. */
export function buildChain(ops: string[], max: number, negatives: boolean): Question | null {
  const nums = pickNumbers(ops, max, negatives);
  const answer = nums && evaluate(nums, ops, max, negatives);
  if (!nums || answer === null) return null;
  return { tokens: toTokens(nums, ops), answer, key: questionKey(nums, ops) };
}
