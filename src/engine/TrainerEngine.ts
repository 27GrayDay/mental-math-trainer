import { TRAINER } from '../constants';
import { generateQuestion, hasEnabledOps } from '../domain';
import { playSound, unlockSounds } from '../services/sound';
import { loadRecord, saveRecord } from '../services/storage';
import type { HistoryEntry, Phase, Question, Settings } from '../types';

/**
 * Состояние и правила одной тренировки. Не знает про React: это внешнее хранилище,
 * к которому компоненты подключаются через useSyncExternalStore (`subscribe` + `getSnapshot`).
 *
 * Фазы: running → (верно) → следующий пример;
 *       running → (ошибка / время вышло / «не знаю») → correction: время на вопрос стоит, пока ученик не введёт
 *       верный ответ; общее время тренировки при этом продолжает идти;
 *       running | correction ⇄ paused: пауза останавливает все таймеры.
 *
 * Повторы: пример с ошибкой возвращается через 3–5 примеров и так до верного ответа;
 * верно решённые примеры не повторяются, пока не пройден весь набор.
 */
export class TrainerEngine {
  phase: Phase = 'idle';
  settings: Settings | null = null;
  question: Question | null = null;
  input = '';
  points = 0; correct = 0; wrong = 0; streak = 0; multiplier = 1;
  history: HistoryEntry[] = []; // от старых к новым
  answerTimes: number[] = [];
  record = loadRecord();
  newRecord = false;
  questionEnd = 0; // 0 — без ограничения
  sessionEnd = 0;

  private seen = new Set<string>();
  private step = 0; // сколько примеров уже показано
  private retries: { question: Question; dueStep: number }[] = [];
  private questionStart = 0;
  private correctionStart = 0;
  private pausedPhase: 'running' | 'correction' = 'running';
  private pauseStart = 0;

  // ---- подписка для useSyncExternalStore ----
  private listeners = new Set<() => void>();
  private version = 0;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  /** Номер версии меняется при каждом изменении — по нему React понимает, что пора перерисовать. */
  getSnapshot = () => this.version;
  private emit() { this.version++; this.listeners.forEach((l) => l()); }

  // ---- производные значения ----
  get isActive() { return this.phase === 'running' || this.phase === 'correction' || this.phase === 'paused'; }
  get canType() { return this.phase === 'running' || this.phase === 'correction'; }
  get isPaused() { return this.phase === 'paused'; }
  get answered() { return this.correct + this.wrong; }
  get mistakes() { return this.history.filter((h) => !h.correct); }
  get averageSeconds() {
    return this.answerTimes.length ? this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length / 1000 : null;
  }
  /** Момент времени для шкалы вопроса: она стоит при исправлении ошибки и на паузе. */
  private get questionClock() {
    const phase = this.phase === 'paused' ? this.pausedPhase : this.phase;
    if (phase === 'correction') return this.correctionStart;
    return this.phase === 'paused' ? this.pauseStart : Date.now();
  }
  get questionProgress() {
    if (!this.settings || !this.questionEnd || !this.isActive) return 1;
    return Math.max(0, (this.questionEnd - this.questionClock) / (this.settings.questionSec * 1000));
  }
  get sessionProgress() {
    if (!this.isActive || !this.settings) return 1;
    const now = this.phase === 'paused' ? this.pauseStart : Date.now();
    return Math.max(0, (this.sessionEnd - now) / (this.settings.durationMin * 60000));
  }

  // ---- действия ----
  start(settings: Settings) {
    if (!hasEnabledOps(settings)) return;
    Object.assign(this, {
      settings: { ...settings }, question: null, points: 0, correct: 0, wrong: 0, streak: 0, multiplier: 1,
      history: [], answerTimes: [], newRecord: false,
    });
    this.seen.clear();
    this.step = 0;
    this.retries = [];
    this.sessionEnd = Date.now() + settings.durationMin * 60000;
    if (settings.sound) unlockSounds();
    this.nextQuestion();
    this.emit();
  }

  setSound(on: boolean) {
    if (this.settings) this.settings = { ...this.settings, sound: on };
    if (on) unlockSounds();
  }

  pause() {
    if (!this.canType) return;
    this.pausedPhase = this.phase as 'running' | 'correction';
    this.pauseStart = Date.now();
    this.phase = 'paused';
    this.emit();
  }

  resume() {
    if (this.phase !== 'paused') return;
    const pausedFor = Date.now() - this.pauseStart;
    this.sessionEnd += pausedFor;
    if (this.pausedPhase === 'running') {
      if (this.questionEnd) this.questionEnd += pausedFor;
      this.questionStart += pausedFor; // пауза не входит во время ответа
    }
    this.phase = this.pausedPhase;
    this.emit();
  }

  togglePause() { return this.phase === 'paused' ? this.resume() : this.pause(); }

  /** Ввод символа: цифры, минус, ⌫. Ответ проверяется сразу, как только набрана нужная длина. */
  press(key: string) {
    if (!this.canType) return;
    const answer = this.question!.answer;
    if (key === '⌫') this.input = this.input.slice(0, -1);
    else if (key === '-') { if (!this.input) this.input = '-'; }
    else if (/^\d$/.test(key) && this.input.length < 6) {
      this.input += key;
      if (Number(this.input) === answer || this.input.length >= String(answer).length) return this.submitInput();
    }
    this.emit();
  }

  enter() {
    if (this.canType && this.input && this.input !== '-') return this.submitInput();
    this.emit();
  }

  dontKnow() {
    if (this.phase === 'running') { this.fail(null); this.emit(); }
  }

  close() { this.phase = 'idle'; this.emit(); }

  /** Вызывается по таймеру. Время тренировки идёт всегда, время на вопрос — только пока не исправляется ошибка. */
  tick() {
    if (!this.isActive || this.phase === 'paused') return;
    const now = Date.now();
    if (now >= this.sessionEnd) this.finish();
    else if (this.phase === 'running' && this.questionEnd && now >= this.questionEnd) this.fail(null);
    this.emit();
  }

  // ---- внутренние шаги ----
  private submitInput() {
    const given = this.input;
    if (Number(given) === this.question!.answer) this.accept();
    else if (this.phase === 'running') this.fail(given);
    else this.input = ''; // при исправлении неверный ввод просто стирается
    this.emit();
  }

  private accept() {
    if (this.phase === 'running') {
      this.correct++; this.streak++;
      this.points += this.multiplier;
      this.multiplier = Math.min(TRAINER.maxMultiplier, 1 + Math.floor(this.streak / TRAINER.streakStep));
      this.answerTimes.push(Date.now() - this.questionStart);
      this.history.push({ question: this.question!, given: null, correct: true });
      if (this.settings!.sound) playSound('correct');
    }
    this.nextQuestion();
  }

  private fail(given: string | null) {
    this.wrong++; this.streak = 0; this.multiplier = 1;
    this.history.push({ question: this.question!, given, correct: false });
    const { retryMin, retryMax } = TRAINER;
    const gap = retryMin + Math.floor(Math.random() * (retryMax - retryMin + 1));
    this.retries.push({ question: this.question!, dueStep: this.step + gap }); // вернётся через несколько примеров
    this.phase = 'correction';
    this.correctionStart = Date.now();
    this.input = '';
    if (this.settings!.sound) playSound('wrong');
  }

  private nextQuestion() {
    const s = this.settings!;
    this.step++;
    const due = this.retries.filter((r) => r.dueStep <= this.step).sort((a, b) => a.dueStep - b.dueStep)[0];
    if (due) {
      this.retries = this.retries.filter((r) => r !== due);
      this.question = due.question;
    } else {
      this.question = generateQuestion(s, this.seen, this.question?.answer);
    }
    this.input = '';
    this.phase = 'running';
    this.questionStart = Date.now();
    this.questionEnd = s.questionSec ? this.questionStart + s.questionSec * 1000 : 0;
  }

  private finish() {
    this.phase = 'finished';
    if (this.points > this.record) { this.record = this.points; this.newRecord = true; saveRecord(this.record); }
  }
}
