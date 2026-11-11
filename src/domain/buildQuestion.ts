import type { OpId, Question, Settings } from '../types';
import { buildChain } from './chain';
import { fromOption } from './optionGenerators';
import { pick } from './random';

const SYMBOL_OF: Partial<Record<OpId, string>> = { add: '+', sub: '-', mul: '*', div: '/' };

export const enabledOps = (s: Settings) => (Object.keys(s.options) as OpId[]).filter((op) => s.options[op].length > 0);

export const hasEnabledOps = (s: Settings) => enabledOps(s).length > 0;

/** Верхняя граница чисел для примеров из трёх чисел — по самым «широким» выбранным пунктам. */
function chainLimit(s: Settings, ops: OpId[]): number {
  const bounds = ops.flatMap((op) => s.options[op]).map((id) => {
    const [kind, arg] = id.split(':');
    return kind === 'table' ? 100 : kind === 'by' ? Number(arg) * 10 : Number(arg);
  });
  return Math.max(...bounds);
}

/** Одна попытка построить пример; null — не получилось, нужно повторить. */
export function buildQuestion(s: Settings): Question | null {
  const ops = enabledOps(s);
  if (!ops.length) return null;
  const binary = ops.filter((op) => op in SYMBOL_OF);
  if (s.count === 3 && binary.length) {
    const symbols = [pick(binary), pick(binary)].map((op) => SYMBOL_OF[op]!);
    return buildChain(symbols, chainLimit(s, binary), s.negatives);
  }
  const op = pick(ops);
  return fromOption(op, pick(s.options[op]), s.negatives);
}
