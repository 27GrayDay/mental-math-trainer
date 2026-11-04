import { Box, ButtonBase } from '@mui/material';
import type { ReactNode } from 'react';
import { Card } from './Card';

/** Сгруппированный список: строки разделены тонкими линиями. */
export function ListGroup({ children }: { children: ReactNode }) {
  return <Card sx={{ p: 0, overflow: 'hidden', '& > * + *': { borderTop: '0.5px solid var(--separator)' } }}>{children}</Card>;
}

const rowSx = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%', minHeight: 48, px: 2, py: 0.75, fontSize: 17, textAlign: 'left' } as const;

export function ListRow({ label, children, onClick }: { label: string; children?: ReactNode; onClick?: () => void }) {
  const content = <><span>{label}</span>{children}</>;
  return onClick
    ? <ButtonBase onClick={onClick} sx={rowSx}>{content}</ButtonBase>
    : <Box sx={rowSx}>{content}</Box>;
}
