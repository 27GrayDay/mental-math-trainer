import { useState, useSyncExternalStore } from 'react';
import { StatementsEngine } from '../engine/StatementsEngine';

export function useStatements(): StatementsEngine {
  const [engine] = useState(() => new StatementsEngine());
  useSyncExternalStore(engine.subscribe, engine.getSnapshot);
  return engine;
}
