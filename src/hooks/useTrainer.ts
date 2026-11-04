import { useEffect, useReducer, useRef } from 'react';
import { TrainerEngine } from '../engine/TrainerEngine';

/** Создаёт движок тренировки один раз и перерисовывает компонент при каждом его изменении. */
export function useTrainer(): TrainerEngine {
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  const ref = useRef<TrainerEngine>();
  ref.current ??= new TrainerEngine(rerender);
  const engine = ref.current;
  useEffect(() => {
    const id = setInterval(() => engine.tick(), 100);
    return () => clearInterval(id);
  }, [engine]);
  return engine;
}
