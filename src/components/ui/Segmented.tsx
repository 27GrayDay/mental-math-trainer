import { Box, ButtonBase } from '@mui/material';
import type { ReactNode } from 'react';

interface Props<T extends string | number> {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
  width?: number | string;
}

/** Сегментированный контрол iOS: серая подложка и белый «бегунок» под выбранным пунктом. */
export function Segmented<T extends string | number>({ value, options, onChange, width }: Props<T>) {
  return (
    <Box role="radiogroup" sx={{ display: 'flex', p: '2px', bgcolor: 'var(--fill)', borderRadius: '10px', width }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <ButtonBase key={o.value} role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            sx={{ flex: 1, height: 32, borderRadius: '8px', fontSize: 13, fontWeight: 600, color: 'var(--label)', bgcolor: on ? 'var(--thumb)' : 'transparent', boxShadow: on ? '0 1px 4px rgba(0,0,0,0.18)' : 'none', transition: 'background-color .15s' }}>
            {o.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
