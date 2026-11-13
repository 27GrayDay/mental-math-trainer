import type { Oge19Settings } from './types';

/** Утверждение считается выученным после стольких верных ответов подряд (в разных тренировках). */
export const MASTERED_STREAK = 3;
export const COUNT_OPTIONS = [
  { value: 10, label: '10' }, { value: 20, label: '20' }, { value: 40, label: '40' }, { value: 0, label: 'Все' },
];
export const DEFAULT_OGE_SETTINGS: Oge19Settings = { count: 20, onlyUnlearned: true, sound: true };
