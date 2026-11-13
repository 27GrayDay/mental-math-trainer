import { useEffect } from 'react';
import type { StatementsEngine } from '../engine/StatementsEngine';

/** ← «Неверно», → «Верно»; после ответа → / Enter / пробел — дальше. */
export function useStatementHotkeys(engine: StatementsEngine) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (engine.phase === 'question') {
        if (e.key === 'ArrowRight') engine.answer(true);
        else if (e.key === 'ArrowLeft') engine.answer(false);
        else return;
      } else if (engine.phase === 'answered') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') engine.next();
        else return;
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);
}
