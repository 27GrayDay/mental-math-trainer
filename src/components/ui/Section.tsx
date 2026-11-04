import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

const caption = { fontSize: 13, color: 'var(--secondary)', px: 2 } as const;

/** Группа с подписью сверху и необязательным пояснением снизу, как в «Настройках» iOS. */
export function Section({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  return (
    <Box>
      {title && <Typography sx={{ ...caption, mb: 0.75 }}>{title}</Typography>}
      {children}
      {footer && <Typography sx={{ ...caption, mt: 0.75 }}>{footer}</Typography>}
    </Box>
  );
}
