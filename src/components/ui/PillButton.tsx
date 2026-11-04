import { Button, type ButtonProps } from '@mui/material';

interface Props extends Omit<ButtonProps, 'sx' | 'color'> { selected?: boolean }

/** Чип-кнопка: серая «таблетка», выбранная — синяя. */
export function PillButton({ selected, ...props }: Props) {
  const bg = selected ? 'var(--blue)' : 'var(--fill)';
  return (
    <Button {...props}
      sx={{ minWidth: 0, px: 1.75, py: 0.75, borderRadius: '999px', fontSize: 15, fontWeight: 500, color: selected ? '#fff' : 'var(--label)', bgcolor: bg, '&:hover': { bgcolor: bg, filter: 'brightness(0.96)' } }} />
  );
}
