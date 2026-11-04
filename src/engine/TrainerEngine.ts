import { TRAINER } from '../constants';
import { generateQuestion } from '../domain';
import { playTone } from '../services/sound';
import { loadRecord, saveRecord } from '../services/storage';
import type { HistoryEntry, Phase, Question, Settings } from '../types';

/**
 * Состояние и правила одной тренировки. Не знает про React: UI подписывается через `notify`.
 *
 * Фазы: running → (верно) → следующий пример;
 *       running → (ошибка / время вышло / «не знаю») → correction: время на вопрос стоит, пока ученик не введёт
 *       верный ответ; общее время тренировки при этом продолжает идти.
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
  private questionStart = 0;
  private pausedAt = 0;

  constructor(private notify: () => void) {}

  get isActive() { return this.phase === 'running' || this.phase === 'correction'; }
  get answered() { return this.correct + this.wrong; }
  get mistakes() { return this.history.filter((h) => !h.correct); }
  get averageSeconds() {
    return this.answerTimes.length ? this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length / 1000 : null;
  }
  get questionProgress() {
    if (!this.settings || !this.questionEnd || !this.isActive) return 1;
    const now = this.phase === 'correction' ? this.pausedAt : Date.now(); // шкала вопроса замирает при исправлении
    return Math.max(0, (this.questionEnd - now) / (this.settings.questionSec * 1000));
  }
  get sessionProgress() {
    if (!this.isActive || !this.settings) return 1;
    return Math.max(0, (this.sessionEnd - Date.now()) / (this.settings.durationMin * 60000));
  }

  start(settings: Settings) {
    Object.assign(this, {
      settings: { ...settings }, question: null, points: 0, correct: 0, wrong: 0, streak: 0, multiplier: 1,
      history: [], answerTimes: [], newRecord: false,
    });
    this.seen.clear();
    this.sessionEnd = Date.now() + settings.durationMin * 60000;
    this.nextQuestion();
    this.notify();
  }

  setSound(on: boolean) { if (this.settings) this.settings = { ...this.settings, sound: on }; }

  /** Ввод символа: цифры, минус, ⌫. Ответ проверяется сразу, как только набрана нужная длина. */
  press(key: string) {
    if (!this.isActive) return;
    const answer = this.question!.answer;
    if (key === '⌫') this.input = this.input.slice(0, -1);
    else if (key === '-') { if (!this.input) this.input = '-'; }
    else if (/^\d$/.test(key) && this.input.length < 6) {
      this.input += key;
      if (Number(this.input) === answer || this.input.length >= String(answer).length) return this.submitInput();
    }
    this.notify();
  }

  enter() {
    if (this.isActive && this.input && this.input !== '-') return this.submitInput();
    this.notify();
  }

  dontKnow() {
    if (this.phase === 'running') { this.fail(null); this.notify(); }
  }

  close() { this.phase = 'idle'; this.notify(); }

  /** Вызывается по таймеру. Время тренировки идёт всегда, время на вопрос — только пока не исправляется ошибка. */
  tick() {
    if (!this.isActive) return;
    const now = Date.now();
    if (now >= this.sessionEnd) this.finish();
    else if (this.phase === 'running' && this.questionEnd && now >= this.questionEnd) this.fail(null);
    this.notify();
  }

  private submitInput() {
    const given = this.input;
    if (Number(given) === this.question!.answer) this.accept();
    else if (this.phase === 'running') this.fail(given);
    else this.input = ''; // при исправлении неверный ввод просто стирается
    this.notify();
  }

  private accept() {
    if (this.phase === 'running') {
      this.correct++; this.streak++;
      this.points += this.multiplier;
      this.multiplier = Math.min(TRAINER.maxMultiplier, 1 + Math.floor(this.streak / TRAINER.streakStep));
      this.answerTimes.push(Date.now() - this.questionStart);
      this.history.push({ question: this.question!, given: null, correct: true });
      if (this.settings!.sound) playTone(true);
    }
    this.nextQuestion();
  }

  private fail(given: string | null) {
    this.wrong++; this.streak = 0; this.multiplier = 1;
    this.history.push({ question: this.question!, given, correct: false });
    this.phase = 'correction';
    this.pausedAt = Date.now();
    this.input = '';
    if (this.settings!.sound) playTone(false);
  }

  private nextQuestion() {
    const s = this.settings!;
    this.question = generateQuestion(s, this.seen, this.question?.answer);
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
