import { Box } from '@mui/material';
import { MODE_BAR_HEIGHT } from './ui/layout';
import { Segmented } from './ui/Segmented';

export type Mode = 'calc' | 'oge19';

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'calc', label: 'Устный счёт' },
  { value: 'oge19', label: 'ОГЭ № 19' },
];

/** Переключатель режимов тренажёра: сверху страницы, в стиле сегментного контрола iOS. */
export function ModeSwitcher({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <Box sx={{ height: MODE_BAR_HEIGHT, boxSizing: 'border-box', pt: 'env(safe-area-inset-top, 0px)', px: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Segmented<Mode> width="100%" value={mode} options={OPTIONS} onChange={onChange} />
      </Box>
    </Box>
  );
}
