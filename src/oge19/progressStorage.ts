import { readJson, writeJson } from '../services/storage';
import type { ProgressMap } from './types';

const KEY = 'mm:oge19:progress';
export const loadProgress = () => readJson<ProgressMap>(KEY, {});
export const saveProgress = (progress: ProgressMap) => writeJson(KEY, progress);
