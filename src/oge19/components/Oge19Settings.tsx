import { Button, Stack, Switch, Typography } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { SelectRow } from '../../components/settings/SelectRow';
import { ListGroup, ListRow } from '../../components/ui/List';
import { Section } from '../../components/ui/Section';
import { COUNT_OPTIONS, MASTERED_STREAK } from '../constants';
import type { StatementsEngine } from '../engine/StatementsEngine';
import type { Oge19Settings as Settings } from '../types';

interface Props { settings: Settings; engine: StatementsEngine; onChange: (patch: Partial<Settings>) => void; onStart: () => void }

export function Oge19Settings({ settings, engine, onChange, onStart }: Props) {
  const canStart = engine.poolSize(settings) > 0;
  const reset = () => { if (window.confirm('Сбросить прогресс по всем утверждениям?')) engine.resetProgress(); };
  return (
    <Stack spacing={3}>
      <Typography component="h1" sx={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', px: 2 }}>Настройки</Typography>

      <Section title="Тренировка" footer={canStart ? undefined : 'Все утверждения выучены. Отключите «Только невыученные» или сбросьте прогресс.'}>
        <ListGroup>
          <SelectRow label="Утверждений за раз" value={settings.count} options={COUNT_OPTIONS} onChange={(count) => onChange({ count })} />
          <ListRow label="Только невыученные"><Switch checked={settings.onlyUnlearned} onChange={(e) => onChange({ onlyUnlearned: e.target.checked })} /></ListRow>
          <ListRow label="Звук"><Switch checked={settings.sound} onChange={(e) => onChange({ sound: e.target.checked })} /></ListRow>
        </ListGroup>
      </Section>

      <Section title="Прогресс" footer={`Утверждение считается выученным, когда вы ответили на него верно ${MASTERED_STREAK} раза подряд в разных тренировках. Прогресс хранится в этом браузере.`}>
        <ListGroup>
          <ListRow label="Выучено"><b>{engine.learned} из {engine.totalCount}</b></ListRow>
          <ListRow label="Сбросить прогресс" onClick={reset}><DeleteOutline sx={{ color: 'var(--red)' }} /></ListRow>
        </ListGroup>
      </Section>

      <Button variant="contained" fullWidth disabled={!canStart} onClick={onStart}
        sx={{ height: 52, borderRadius: '26px', fontSize: 17, bgcolor: 'var(--blue)', '&.Mui-disabled': { bgcolor: 'var(--fill)', color: 'var(--secondary)' } }}>
        Начать тренировку
      </Button>
    </Stack>
  );
}
