import { useEffect, useState, useSyncExternalStore } from 'react';
import { TrainerEngine } from '../engine/TrainerEngine';

/** Подключает движок тренировки как внешнее хранилище: React перерисовывает компонент при каждом его изменении. */
export function useTrainer(): TrainerEngine {
  const [engine] = useState(() => new TrainerEngine());
  useSyncExternalStore(engine.subscribe, engine.getSnapshot);
  useEffect(() => {
    const id = setInterval(() => engine.tick(), 100); // шкалы времени и таймауты
    return () => clearInterval(id);
  }, [engine]);
  return engine;
}
