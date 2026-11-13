const read = <T>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* хранилище недоступно */ }
};

export const loadSettings = <T extends object>(defaults: T): T => ({ ...defaults, ...read<Partial<T>>('mm:settings:v2', {}) });
export const saveSettings = (s: object) => write('mm:settings:v2', s);
export const loadRecord = () => read<number>('mm:record', 0);
export const saveRecord = (v: number) => write('mm:record', v);

// Общие функции для других разделов (например, режима ОГЭ)
export { read as readJson, write as writeJson };
