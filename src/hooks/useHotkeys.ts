import { useEffect } from 'react';
import type { TrainerEngine } from '../engine/TrainerEngine';

/** Цифры и «−» — ввод, Backspace — стереть, пробел — показать ответ, Enter — подтвердить, Esc — пауза. */
export function useHotkeys(engine: TrainerEngine) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!engine.isActive) return;
      if (engine.phase === 'paused') { // на паузе любая из этих клавиш продолжает тренировку
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') { engine.resume(); e.preventDefault(); }
        return;
      }
      if (/^\d$/.test(e.key) || e.key === '-') engine.press(e.key);
      else if (e.key === 'Backspace') engine.press('⌫');
      else if (e.key === ' ') engine.dontKnow();
      else if (e.key === 'Enter') engine.enter();
      else if (e.key === 'Escape') engine.pause();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);
}
