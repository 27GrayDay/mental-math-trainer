import { useEffect, useState } from 'react';
import { readJson, writeJson } from '../services/storage';

/** useState, который сохраняется в localStorage. Для объектов недостающие поля берутся из значений по умолчанию. */
export function usePersistentState<T>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = readJson<unknown>(key, null);
    if (stored === null || stored === undefined) return defaults;
    return typeof defaults === 'object' && defaults !== null ? ({ ...defaults, ...(stored as object) } as T) : (stored as T);
  });
  useEffect(() => writeJson(key, value), [key, value]);
  return [value, setValue] as const;
}
