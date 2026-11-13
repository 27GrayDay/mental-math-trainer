import { MASTERED_STREAK } from './constants';
import type { Oge19Settings, ProgressMap, Statement, StatementProgress } from './types';

export const isLearned = (p?: StatementProgress) => (p?.streak ?? 0) >= MASTERED_STREAK;

const shuffle = <T>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Приоритет: сначала те, где были ошибки, потом новые, потом с короткой серией; выученные — в самом конце. */
const weight = (p?: StatementProgress) => (!p ? 0 : p.streak === 0 && p.wrong > 0 ? -1 : p.streak);

export function selectPool(all: Statement[], progress: ProgressMap, onlyUnlearned: boolean): Statement[] {
  return onlyUnlearned ? all.filter((s) => !isLearned(progress[s.id])) : all;
}

/** Колода тренировки: порядок случайный внутри групп с одинаковым приоритетом. */
export function buildDeck(all: Statement[], progress: ProgressMap, settings: Oge19Settings): Statement[] {
  const sorted = shuffle(selectPool(all, progress, settings.onlyUnlearned)).sort((a, b) => weight(progress[a.id]) - weight(progress[b.id]));
  return settings.count > 0 ? sorted.slice(0, settings.count) : sorted;
}
