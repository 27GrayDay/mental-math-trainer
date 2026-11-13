import { Box } from '@mui/material';
import { useState } from 'react';

/** Чертёж к разбору из public/figures/. Если файла нет, блок просто не показывается. */
export function Figure({ file }: { file: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Box component="img" src={`${import.meta.env.BASE_URL}figures/${file}`} alt="Чертёж к разбору" onError={() => setFailed(true)}
      sx={{ display: 'block', maxWidth: '100%', maxHeight: 280, mt: 2, borderRadius: '14px', bgcolor: '#fff' }} />
  );
}
