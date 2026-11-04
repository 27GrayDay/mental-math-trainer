import type { Question, Settings } from '../types';
import { buildQuestion } from './buildQuestion';

const ATTEMPTS = 400;

/**
 * Возвращает пример, которого ещё не было в `seen`, и не повторяет подряд один ответ.
 * Если все варианты исчерпаны — список использованных сбрасывается.
 */
export function generateQuestion(s: Settings, seen: Set<string>, lastAnswer?: number): Question {
  for (let round = 0; round < 2; round++) {
    for (let i = 0; i < ATTEMPTS; i++) {
      const q = buildQuestion(s);
      if (q && !seen.has(q.key) && (round === 1 || q.answer !== lastAnswer)) { seen.add(q.key); return q; }
    }
    seen.clear();
  }
  for (let i = 0; i < ATTEMPTS * 10; i++) {
    const q = buildQuestion(s);
    if (q) { seen.add(q.key); return q; }
  }
  throw new Error('Для выбранных настроек нет подходящих примеров');
}
