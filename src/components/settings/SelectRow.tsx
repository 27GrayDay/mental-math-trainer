import { MenuItem, Select } from '@mui/material';
import { ListRow } from '../ui/List';

interface Props { label: string; value: number; options: { value: number; label: string }[]; onChange: (v: number) => void }

/** Строка списка: название слева, выбранное значение синим справа. */
export function SelectRow({ label, value, options, onChange }: Props) {
  return (
    <ListRow label={label}>
      <Select variant="standard" disableUnderline value={value} onChange={(e) => onChange(Number(e.target.value))}
        sx={{ color: 'var(--blue)', fontSize: 17, '& .MuiSelect-select': { py: 0, textAlign: 'right' }, '& .MuiSelect-icon': { color: 'var(--secondary)' } }}>
        {options.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </Select>
    </ListRow>
  );
}
