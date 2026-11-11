/** Математические действия; у каждого своё меню вариантов в настройках. */
export type OpId = 'add' | 'sub' | 'mul' | 'div' | 'pow' | 'root';
export type Phase = 'idle' | 'running' | 'correction' | 'paused' | 'finished';

export interface Settings {
  /** Выбранные пункты меню каждой операции. Операция включена, если выбран хотя бы один пункт. */
  options: Record<OpId, string[]>;
  negatives: boolean;
  count: 2 | 3;
  durationMin: number;
  questionSec: number; // 0 — без ограничения
  sound: boolean;
  keyboard: boolean;
}

export type TokenKind = 'first' | 'second' | 'third' | 'operator';
export interface Token { text: string; kind: TokenKind }
export interface Question { tokens: Token[]; answer: number; key: string }
/** Запись истории: верно решённый пример или ошибка (given — что ввёл ученик, null — не знал/время вышло). */
export interface HistoryEntry { question: Question; given: string | null; correct: boolean }
