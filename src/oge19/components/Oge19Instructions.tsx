import { Typography } from '@mui/material';
import { Card } from '../../components/ui/Card';
import { Section } from '../../components/ui/Section';

const ITEMS = [
  'Прочитайте утверждение и выберите «Верно» или «Неверно» (клавиши ← и →).',
  'После ответа показывается разбор: почему утверждение верное или неверное. Enter или пробел — следующее.',
  'Утверждения, в которых вы ошиблись, вернутся через несколько шагов, пока вы не ответите верно.',
  'Выученные утверждения (верно три раза подряд в разных тренировках) больше не показываются, если включено «Только невыученные».',
];

export function Oge19Instructions() {
  return (
    <Section title="Как это работает">
      <Card>
        <Typography component="ul" sx={{ fontSize: 15, pl: 2.5, m: 0, '& li': { mb: 0.75 }, '& li:last-child': { mb: 0 } }}>
          {ITEMS.map((t) => <li key={t}>{t}</li>)}
        </Typography>
      </Card>
    </Section>
  );
}
