import { Box, ButtonBase } from '@mui/material';
import { OPERATIONS } from '../../constants';
import type { OpId } from '../../types';

interface Props { viewed: OpId; enabled: Record<OpId, boolean>; onView: (op: OpId) => void }

/**
 * Сегментированный контрол действий. Белый «бегунок» — открытое меню,
 * синий символ — действие включено (в его меню выбран хотя бы один пункт).
 */
export function OperationsPicker({ viewed, enabled, onView }: Props) {
  return (
    <Box sx={{ display: 'flex', p: '2px', bgcolor: 'var(--fill)', borderRadius: '12px' }}>
      {OPERATIONS.map(({ id, label }) => {
        const open = viewed === id, on = enabled[id];
        return (
          <ButtonBase key={id} onClick={() => onView(id)} aria-pressed={open}
            sx={{ flex: 1, height: 38, borderRadius: '10px', fontSize: 20, fontWeight: on ? 700 : 400, color: on ? 'var(--blue)' : 'var(--secondary)', bgcolor: open ? 'var(--thumb)' : 'transparent', boxShadow: open ? '0 1px 4px rgba(0,0,0,0.18)' : 'none', transition: 'background-color .15s' }}>
            {label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
