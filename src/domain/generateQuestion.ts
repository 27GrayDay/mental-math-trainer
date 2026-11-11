import type { Question, Settings } from '../types';
import { buildQuestion } from './buildQuestion';

/** Случайно перебирает варианты, пока не найдёт пример, которого нет в `seen` (и ответ ≠ `avoid`). */
function sample(s: Settings, seen: Set<string>, attempts: number, avoid?: number): Question | null {
  for (let i = 0; i < attempts; i++) {
    const q = buildQuestion(s);
    if (q && !seen.has(q.key) && q.answer !== avoid) return q;
  }
  return null;
}

const find = (s: Settings, seen: Set<string>, lastAnswer?: number) =>
  sample(s, seen, 400, lastAnswer) ?? sample(s, seen, 4000); // второй проход: без условия «ответ ≠ предыдущего», с большим запасом попыток

/**
 * Возвращает пример, которого ещё не было в `seen`, и старается не повторять подряд один ответ.
 * `seen` очищается только когда новых примеров не осталось совсем — то есть набор пройден целиком.
 */
export function generateQuestion(s: Settings, seen: Set<string>, lastAnswer?: number): Question {
  let q = find(s, seen, lastAnswer);
  if (!q) { seen.clear(); q = find(s, seen, lastAnswer); }
  if (!q) throw new Error('Для выбранных настроек нет подходящих примеров');
  seen.add(q.key);
  return q;
}
