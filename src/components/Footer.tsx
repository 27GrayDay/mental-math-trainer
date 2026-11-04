import { Link, Typography } from '@mui/material';

/** Адрес репозитория подставляется при сборке на GitHub (см. .github/workflows/deploy.yml). */
const REPO_URL = import.meta.env.VITE_REPO_URL as string | undefined;

export function Footer() {
  return (
    <Typography sx={{ textAlign: 'center', fontSize: 13, color: 'var(--secondary)', px: 2, pt: 4, pb: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
      Открытый исходный код · лицензия MIT
      {REPO_URL && <> · <Link href={REPO_URL} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ color: 'var(--blue)' }}>GitHub</Link></>}
    </Typography>
  );
}
