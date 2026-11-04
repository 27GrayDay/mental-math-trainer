import type { Question } from '../types';

export const SYMBOLS: Record<string, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
export const formatNumber = (n: number | string) => String(n).replace('-', '−');
export const questionToText = (q: Question) => q.tokens.map((t) => t.text).join(' ');
export const superscript = (n: number) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
