import { Box, ButtonBase } from '@mui/material';
import Check from '@mui/icons-material/Check';
import type { OperationDef } from '../../constants';
import { PillButton } from '../ui/PillButton';

interface Props { operation: OperationDef; selected: string[]; onToggle: (optionId: string) => void }

/** Меню действия: короткие пункты — чипы, длинные — строки списка с галочкой. Выбирать можно несколько. */
export function OptionMenu({ operation, selected, onToggle }: Props) {
  if (operation.menu.every((o) => o.row === 'block')) {
    return (
      <Box sx={{ '& > * + *': { borderTop: '0.5px solid var(--separator)' } }}>
        {operation.menu.map((o) => (
          <ButtonBase key={o.id} onClick={() => onToggle(o.id)} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', minHeight: 48, px: 2, py: 1, fontSize: 17, textAlign: 'left' }}>
            <span>{o.label}</span>
            {selected.includes(o.id) && <Check sx={{ color: 'var(--blue)' }} />}
          </ButtonBase>
        ))}
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', p: 2 }}>
      {operation.menu.map((o) => (
        <Box key={o.id} sx={{ flexBasis: o.row ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
          <PillButton selected={selected.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</PillButton>
        </Box>
      ))}
    </Box>
  );
}
