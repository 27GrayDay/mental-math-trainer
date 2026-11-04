import { useEffect } from 'react';
import type { TrainerEngine } from '../engine/TrainerEngine';

/** Цифры и «−» — ввод, Backspace — стереть, пробел — показать ответ, Enter — подтвердить/дальше. */
export function useHotkeys(engine: TrainerEngine) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!engine.isActive) return;
      if (/^\d$/.test(e.key) || e.key === '-') engine.press(e.key);
      else if (e.key === 'Backspace') engine.press('⌫');
      else if (e.key === ' ') engine.dontKnow();
      else if (e.key === 'Enter') engine.enter();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);
}
