export interface Statement {
  id: string;
  text: string;
  /** true — утверждение верное, false — неверное. */
  answer: boolean;
  explanation: string;
  /** Имя файла чертежа в public/figures/ (необязательно). */
  figure?: string;
}

export interface Oge19Settings {
  count: number; // сколько утверждений в тренировке; 0 — все
  onlyUnlearned: boolean;
  sound: boolean;
}

export type Oge19Phase = 'idle' | 'question' | 'answered' | 'finished';

export interface StatementProgress { streak: number; seen: number; wrong: number }
export type ProgressMap = Record<string, StatementProgress>;
export interface Attempt { statement: Statement; chosen: boolean; correct: boolean }
