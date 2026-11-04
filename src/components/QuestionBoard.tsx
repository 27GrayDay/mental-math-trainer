import { Box, Button, Typography } from '@mui/material';
import type { TrainerEngine } from '../engine/TrainerEngine';
import { ExpressionView } from './ExpressionView';
import { HistoryList } from './HistoryList';
import { Card } from './ui/Card';
import { ProgressTrack } from './ui/ProgressTrack';

interface Props { engine: TrainerEngine; mobile: boolean; keyboardVisible: boolean }

/** Пример и история. Верхняя шкала — время на вопрос, нижняя — время тренировки. */
export function QuestionBoard({ engine, mobile, keyboardVisible }: Props) {
  return (
    <Card sx={{ p: 0, borderRadius: '28px', display: 'flex', flexDirection: 'column', flex: mobile ? 1 : undefined, minHeight: 0 }}>
      <Box sx={{ px: 3, pt: 2.5 }}><ProgressTrack value={engine.questionProgress} color="var(--blue)" /></Box>
      <Box sx={{ flex: 1, minHeight: mobile ? 0 : 380, overflow: 'hidden', px: 3, pt: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' } }}>
        <ExpressionView engine={engine} />
        {engine.isActive && <HistoryList entries={engine.history} />}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: keyboardVisible ? 'flex-end' : 'space-between', alignItems: 'center', gap: 2, px: 3, pb: 1 }}>
        {!keyboardVisible && (
          <Typography sx={{ flex: 1, fontSize: 13, color: 'var(--secondary)' }}>Вводите цифры с клавиатуры. Пробел — показать ответ.</Typography>
        )}
        <Button disabled={engine.phase !== 'running'} onClick={() => engine.dontKnow()} sx={{ fontWeight: 500, color: 'var(--blue)' }}>Не знаю</Button>
      </Box>
      <Box sx={{ px: 3, pb: 2.5 }}><ProgressTrack value={engine.sessionProgress} color="var(--green)" /></Box>
    </Card>
  );
}
