import { TRAINER } from '../../constants';
import { playSound, unlockSounds } from '../../services/sound';
import { STATEMENTS } from '../data/statements';
import { buildDeck, isLearned, selectPool } from '../deck';
import { loadProgress, saveProgress } from '../progressStorage';
import type { Attempt, Oge19Phase, Oge19Settings, ProgressMap, Statement } from '../types';

/**
 * Тренировка по утверждениям: показываем одно утверждение, ученик отвечает «верно/неверно», затем видит разбор.
 * Утверждения с ошибкой возвращаются через 3–5 шагов, пока ученик не ответит верно.
 * Прогресс по каждому утверждению хранится в браузере: выученные (3 верных подряд) можно скрывать.
 *
 * Как и движок счёта, это внешнее хранилище для useSyncExternalStore.
 */
export class StatementsEngine {
  phase: Oge19Phase = 'idle';
  settings: Oge19Settings | null = null;
  current: Statement | null = null;
  lastCorrect: boolean | null = null;
  correct = 0; wrong = 0; streak = 0;
  attempts: Attempt[] = [];
  total = 0; // сколько утверждений в колоде этой тренировки (без учёта повторов)
  progress: ProgressMap = loadProgress();

  private queue: Statement[] = [];
  private retries: { statement: Statement; dueStep: number }[] = [];
  private step = 0;

  private listeners = new Set<() => void>();
  private version = 0;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  getSnapshot = () => this.version;
  private emit() { this.version++; this.listeners.forEach((l) => l()); }

  get totalCount() { return STATEMENTS.length; }
  get learned() { return STATEMENTS.filter((s) => isLearned(this.progress[s.id])).length; }
  get isActive() { return this.phase === 'question' || this.phase === 'answered'; }
  get remaining() { return this.queue.length + this.retries.length + (this.phase === 'question' ? 1 : 0); }
  get sessionProgress() { return this.total ? 1 - this.remaining / this.total : 0; }
  /** После этого ответа тренировка закончится. */
  get isLast() { return this.queue.length === 0 && this.retries.length === 0; }
  /** Утверждения, в которых были ошибки (без повторов). */
  get mistakes(): Statement[] {
    const seen = new Set<string>();
    return this.attempts.filter((a) => !a.correct && !seen.has(a.statement.id) && seen.add(a.statement.id)).map((a) => a.statement);
  }

  poolSize(settings: Oge19Settings) { return selectPool(STATEMENTS, this.progress, settings.onlyUnlearned).length; }

  /** Возвращает false, если по настройкам не из чего составить тренировку. */
  start(settings: Oge19Settings): boolean {
    const deck = buildDeck(STATEMENTS, this.progress, settings);
    if (!deck.length) return false;
    Object.assign(this, { settings: { ...settings }, current: null, lastCorrect: null, correct: 0, wrong: 0, streak: 0, attempts: [] });
    this.queue = deck;
    this.total = deck.length;
    this.retries = [];
    this.step = 0;
    if (settings.sound) unlockSounds();
    this.pickNext();
    this.emit();
    return true;
  }

  setSound(on: boolean) {
    if (this.settings) this.settings = { ...this.settings, sound: on };
    if (on) unlockSounds();
  }

  answer(chosen: boolean) {
    if (this.phase !== 'question' || !this.current) return;
    const statement = this.current;
    const ok = chosen === statement.answer;
    this.lastCorrect = ok;
    this.phase = 'answered';
    this.attempts.push({ statement, chosen, correct: ok });
    this.record(statement, ok);
    if (ok) { this.correct++; this.streak++; }
    else {
      this.wrong++; this.streak = 0;
      const { retryMin, retryMax } = TRAINER;
      const gap = retryMin + Math.floor(Math.random() * (retryMax - retryMin + 1));
      this.retries.push({ statement, dueStep: this.step + gap });
    }
    if (this.settings!.sound) playSound(ok ? 'correct' : 'wrong');
    this.emit();
  }

  next() {
    if (this.phase !== 'answered') return;
    this.pickNext();
    this.emit();
  }

  finish() { this.phase = 'finished'; this.current = null; this.emit(); }
  close() { this.phase = 'idle'; this.emit(); }

  resetProgress() {
    this.progress = {};
    saveProgress(this.progress);
    this.emit();
  }

  private record(statement: Statement, ok: boolean) {
    const p = this.progress[statement.id] ?? { streak: 0, seen: 0, wrong: 0 };
    this.progress = { ...this.progress, [statement.id]: { streak: ok ? p.streak + 1 : 0, seen: p.seen + 1, wrong: p.wrong + (ok ? 0 : 1) } };
    saveProgress(this.progress);
  }

  private pickNext() {
    this.step++;
    let next: Statement | undefined;
    const due = this.retries.filter((r) => r.dueStep <= this.step).sort((a, b) => a.dueStep - b.dueStep)[0];
    if (due) {
      this.retries = this.retries.filter((r) => r !== due);
      next = due.statement;
    } else {
      next = this.queue.shift() ?? this.retries.shift()?.statement; // колода кончилась — отдаём оставшиеся повторы
    }
    if (!next) { this.phase = 'finished'; this.current = null; return; }
    this.current = next;
    this.lastCorrect = null;
    this.phase = 'question';
  }
}
