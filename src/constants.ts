import type { OpId, Settings } from './types';

/** `own` — пункт на отдельной строке, `block` — на отдельной строке во всю ширину. */
export interface MenuOption { id: string; label: string; row?: 'own' | 'block' }
export interface OperationDef { id: OpId; label: string; menu: MenuOption[]; binary: boolean }

const ranges = (): MenuOption[] => [10, 20, 50, 100, 1000].map((n) => ({ id: `max:${n}`, label: `до ${n}` }));
const tableMenu = (name: string): MenuOption[] => [
  { id: 'upto:25', label: 'до 25' }, { id: 'upto:50', label: 'до 50' },
  { id: 'table', label: `Таблица ${name}`, row: 'own' },
  ...[2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((n) => ({ id: `by:${n}`, label: `на ${n}` })),
  { id: 'upto:400', label: 'до 400' }, { id: 'upto:1000', label: 'до 1000' },
];
const block = (id: string, label: string): MenuOption => ({ id, label, row: 'block' });

export const OPERATIONS: OperationDef[] = [
  { id: 'add', label: '+', binary: true, menu: ranges() },
  { id: 'sub', label: '−', binary: true, menu: ranges() },
  { id: 'mul', label: '×', binary: true, menu: tableMenu('умножения') },
  { id: 'div', label: '÷', binary: true, menu: tableMenu('деления') },
  { id: 'pow', label: 'xⁿ', binary: false, menu: [
    block('pow2:10', 'Степени двойки до 10'), block('sq:10', 'Возведение в квадрат чисел до 10'),
    block('sq:20', 'Возведение в квадрат чисел до 20'), block('pow3:6', 'Степени тройки'),
    block('cube:10', 'Возведение в куб чисел до 10'),
  ] },
  { id: 'root', label: '√', binary: false, menu: [
    block('root:100', 'Извлечение корня из чисел до 100'), block('root:400', 'Извлечение корня из чисел до 400'),
    block('root:1024', 'Извлечение корня из чисел до 1024'),
  ] },
];

export const DURATION_OPTIONS = [
  { value: 1, label: '1 минута' }, { value: 3, label: '3 минуты' }, { value: 5, label: '5 минут' },
  { value: 10, label: '10 минут' }, { value: 15, label: '15 минут' },
];
export const QUESTION_TIME_OPTIONS = [
  { value: 5, label: '5 секунд' }, { value: 10, label: '10 секунд' }, { value: 15, label: '15 секунд' },
  { value: 30, label: '30 секунд' }, { value: 60, label: '60 секунд' }, { value: 0, label: 'Без ограничения' },
];
export const DEFAULT_SETTINGS: Settings = {
  options: { add: [], sub: [], mul: [], div: [], pow: [], root: [] }, // по умолчанию ничего не выбрано
  negatives: false, count: 2, durationMin: 3, questionSec: 30, sound: true,
  keyboard: typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches,
};

/** Цвета берутся из CSS-переменных темы (см. theme.ts), поэтому работают и в светлой, и в тёмной теме. */
export const COLORS = {
  first: 'var(--blue)', second: 'var(--orange)', third: 'var(--teal)', operator: 'var(--label)',
  primary: 'var(--blue)', success: 'var(--green)', danger: 'var(--red)', warning: 'var(--orange)',
};
/** retryMin/retryMax — через сколько примеров вернётся пример, в котором была ошибка. */
export const TRAINER = { streakStep: 5, maxMultiplier: 10, historyVisible: 5, retryMin: 3, retryMax: 5 };
