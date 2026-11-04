import { Paper, type PaperProps } from '@mui/material';

/** Карточка в стиле iOS: цвет системной «группы», крупное скругление, без рамки и тени. */
export function Card({ sx, ...props }: Omit<PaperProps, 'elevation'>) {
  return (
    <Paper elevation={0} sx={[{ p: 2.5, bgcolor: 'var(--card)', backgroundImage: 'none', borderRadius: '22px' }, ...(Array.isArray(sx) ? sx : [sx])]} {...props} />
  );
}
