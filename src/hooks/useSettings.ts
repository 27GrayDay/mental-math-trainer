import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS } from '../constants';
import { loadSettings, saveSettings } from '../services/storage';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings(DEFAULT_SETTINGS));
  useEffect(() => saveSettings(settings), [settings]);
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return [settings, update] as const;
}
