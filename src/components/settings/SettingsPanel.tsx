import { useState } from 'react';
import { Box, Button, Stack, Switch, Typography } from '@mui/material';
import Fullscreen from '@mui/icons-material/Fullscreen';
import { DURATION_OPTIONS, OPERATIONS, QUESTION_TIME_OPTIONS } from '../../constants';
import type { OpId, Settings } from '../../types';
import { Card } from '../ui/Card';
import { ListGroup, ListRow } from '../ui/List';
import { Section } from '../ui/Section';
import { Segmented } from '../ui/Segmented';
import { OperationsPicker } from './OperationsPicker';
import { OptionMenu } from './OptionMenu';
import { SelectRow } from './SelectRow';

interface Props { settings: Settings; onChange: (patch: Partial<Settings>) => void; onStart: () => void }

const toggleFullscreen = () =>
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();

export function SettingsPanel({ settings, onChange, onStart }: Props) {
  const [viewed, setViewed] = useState<OpId>('add');
  const operation = OPERATIONS.find((o) => o.id === viewed)!;
  const enabled = Object.fromEntries(OPERATIONS.map((o) => [o.id, settings.options[o.id].length > 0])) as Record<OpId, boolean>;

  const toggleOption = (id: string) => {
    const current = settings.options[viewed];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    const options = { ...settings.options, [viewed]: next };
    if (OPERATIONS.some((o) => options[o.id].length)) onChange({ options }); // хотя бы одно действие должно остаться
  };

  return (
    <Stack spacing={3}>
      <Typography component="h1" sx={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', px: 2 }}>Настройки</Typography>

      <Section title="Действия" footer="Синим отмечены включённые действия: чтобы включить, выберите хотя бы один пункт в его меню.">
        <Card sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 1.5 }}><OperationsPicker viewed={viewed} enabled={enabled} onView={setViewed} /></Box>
          <Box sx={{ borderTop: '0.5px solid var(--separator)' }}>
            <OptionMenu operation={operation} selected={settings.options[viewed]} onToggle={toggleOption} />
          </Box>
        </Card>
      </Section>

      {operation.binary && (
        <Section title="Числа в примере">
          <ListGroup>
            <ListRow label="Отрицательные числа">
              <Switch checked={settings.negatives} onChange={(e) => onChange({ negatives: e.target.checked })} />
            </ListRow>
            <ListRow label="Количество чисел">
              <Segmented<2 | 3> width={120} value={settings.count} onChange={(count) => onChange({ count })}
                options={[{ value: 2, label: '2' }, { value: 3, label: '3' }]} />
            </ListRow>
          </ListGroup>
        </Section>
      )}

      <Section title="Время">
        <ListGroup>
          <SelectRow label="Тренировка" value={settings.durationMin} options={DURATION_OPTIONS} onChange={(durationMin) => onChange({ durationMin })} />
          <SelectRow label="На один вопрос" value={settings.questionSec} options={QUESTION_TIME_OPTIONS} onChange={(questionSec) => onChange({ questionSec })} />
        </ListGroup>
      </Section>

      <Section title="Интерфейс">
        <ListGroup>
          <ListRow label="Экранная клавиатура"><Switch checked={settings.keyboard} onChange={(e) => onChange({ keyboard: e.target.checked })} /></ListRow>
          <ListRow label="Звук"><Switch checked={settings.sound} onChange={(e) => onChange({ sound: e.target.checked })} /></ListRow>
          <ListRow label="Во весь экран" onClick={toggleFullscreen}><Fullscreen sx={{ color: 'var(--blue)' }} /></ListRow>
        </ListGroup>
      </Section>

      <Button variant="contained" fullWidth onClick={onStart} sx={{ height: 52, borderRadius: '26px', fontSize: 17, bgcolor: 'var(--blue)' }}>
        Начать тренировку
      </Button>
    </Stack>
  );
}
