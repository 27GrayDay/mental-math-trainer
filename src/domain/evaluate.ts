/**
 * Считает выражение с приоритетом × и ÷. Возвращает null для «неприятных» примеров:
 * дробный результат, выход за диапазон, отрицательный промежуточный результат (если они выключены),
 * a ÷ a, a × b ÷ b (знаки при этом не важны).
 */
export function evaluate(nums: number[], ops: string[], limit: number, allowNegative: boolean): number | null {
  const fits = (x: number) => Math.abs(x) <= limit && (allowNegative || x >= 0);
  let total = 0, sign = 1, term = nums[0];
  let factors = [nums[0]]; // множители текущего слагаемого

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], n = nums[i + 1];
    if (op === '*') {
      term *= n; factors.push(n);
    } else if (op === '/') {
      if (term % n !== 0 || Math.abs(term / n) < 2 || factors.some((f) => Math.abs(f) === Math.abs(n))) return null;
      term /= n; factors = [term];
    } else {
      total += sign * term;
      if (!fits(total)) return null;
      sign = op === '+' ? 1 : -1;
      term = n; factors = [n];
    }
    if (!fits(term)) return null;
  }
  total += sign * term;
  return fits(total) ? total : null;
}
