export const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const NEGATIVE_CHANCE = 0.4;
/** С вероятностью 40% меняет знак числа (для режима «Отрицательные числа»). */
export const maybeNegate = (v: number) => (Math.random() < NEGATIVE_CHANCE ? -v : v);
export const pick = <T>(items: T[]): T => items[randInt(0, items.length - 1)];
