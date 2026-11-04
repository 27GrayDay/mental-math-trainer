import type { OpId, Question } from '../types';
import { buildChain } from './chain';
import { formatNumber, SYMBOLS, superscript } from './format';
import { maybeNegate, randInt } from './random';

const kindOf = (opt: string) => opt.split(':')[0];
const argOf = (opt: string) => Number(opt.split(':')[1]);

/** Второй операнд с отрицательным значением пишется в скобках: 3 × (−4). */
const operand = (v: number, i: number) => (i && v < 0 ? `(${formatNumber(v)})` : formatNumber(v));

const binary = (a: number, op: '*' | '/', b: number, answer: number): Question => ({
  tokens: [{ text: operand(a, 0), kind: 'first' }, { text: SYMBOLS[op], kind: 'operator' }, { text: operand(b, 1), kind: 'second' }],
  answer,
  key: op === '*' ? [a, b].sort((x, y) => x - y).join('*') : `${a}/${b}`,
});
const single = (text: string, answer: number): Question => ({ tokens: [{ text, kind: 'first' }], answer, key: text });

/** Пара множителей ≥ 2 с произведением не больше limit (без «2 × 487»: множители до 99). */
function productPair(limit: number): [number, number] | null {
  const cap = Math.min(99, Math.floor(limit / 2));
  for (let i = 0; i < 300; i++) {
    const a = randInt(2, cap), b = randInt(2, cap);
    if (a * b <= limit) return [a, b];
  }
  return null;
}

/** Положительная пара множителей для пункта меню умножения/деления. */
function factorPair(opt: string): [number, number] | null {
  const n = argOf(opt);
  switch (kindOf(opt)) {
    case 'table': return [randInt(2, 10), randInt(2, 10)];
    case 'by': { const b = randInt(2, 10); return Math.random() < 0.5 ? [n, b] : [b, n]; }
    default: return productPair(n);
  }
}

function multiplication(opt: string, negatives: boolean): Question | null {
  const pair = factorPair(opt);
  if (!pair) return null;
  const [a, b] = negatives ? [maybeNegate(pair[0]), maybeNegate(pair[1])] : pair;
  return binary(a, '*', b, a * b);
}

/** Деление строим от ответа: делимое = делитель × частное, поэтому всегда делится нацело (и со знаками тоже). */
function division(opt: string, negatives: boolean): Question | null {
  const pair = factorPair(opt);
  if (!pair) return null;
  let [divisor, quotient] = pair;
  if (opt.startsWith('by:')) [divisor, quotient] = [argOf(opt), randInt(2, 10)]; // «на n»: делитель всегда n
  if (negatives) { divisor = maybeNegate(divisor); quotient = maybeNegate(quotient); }
  return binary(divisor * quotient, '/', divisor, quotient);
}

function power(opt: string): Question {
  const n = argOf(opt);
  switch (kindOf(opt)) {
    case 'pow2': { const k = randInt(2, n); return single(`2${superscript(k)}`, 2 ** k); }
    case 'pow3': { const k = randInt(2, n); return single(`3${superscript(k)}`, 3 ** k); }
    case 'cube': { const a = randInt(2, n); return single(`${a}³`, a ** 3); }
    default: { const a = randInt(2, n); return single(`${a}²`, a * a); } // sq
  }
}

function root(opt: string): Question {
  const r = randInt(2, Math.floor(Math.sqrt(argOf(opt))));
  return single(`√${r * r}`, r);
}

/** Пример по выбранному пункту меню операции. */
export function fromOption(op: OpId, opt: string, negatives: boolean): Question | null {
  switch (op) {
    case 'add': return buildChain(['+'], argOf(opt), negatives);
    case 'sub': return buildChain(['-'], argOf(opt), negatives);
    case 'mul': return multiplication(opt, negatives);
    case 'div': return division(opt, negatives);
    case 'pow': return power(opt);
    case 'root': return root(opt);
  }
}
