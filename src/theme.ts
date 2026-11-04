import { createTheme } from '@mui/material';

export const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif';

/** Цвета iOS как CSS-переменные: светлая и тёмная темы переключаются автоматически. */
export const globalStyles = {
  ':root': {
    '--bg': '#f2f2f7', '--card': '#ffffff', '--thumb': '#ffffff',
    '--label': '#000000', '--secondary': 'rgba(60,60,67,0.6)', '--separator': 'rgba(60,60,67,0.18)',
    '--fill': 'rgba(120,120,128,0.12)', '--glass': 'rgba(249,249,249,0.78)',
    '--blue': '#007aff', '--green': '#34c759', '--red': '#ff3b30', '--orange': '#ff9500', '--teal': '#30b0c7',
  },
  '@media (prefers-color-scheme: dark)': {
    ':root': {
      '--bg': '#000000', '--card': '#1c1c1e', '--thumb': '#636366',
      '--label': '#ffffff', '--secondary': 'rgba(235,235,245,0.6)', '--separator': 'rgba(84,84,88,0.6)',
      '--fill': 'rgba(120,120,128,0.24)', '--glass': 'rgba(28,28,30,0.72)',
      '--blue': '#0a84ff', '--green': '#30d158', '--red': '#ff453a', '--orange': '#ff9f0a', '--teal': '#40c8e0',
    },
  },
  body: { background: 'var(--bg)', color: 'var(--label)', WebkitFontSmoothing: 'antialiased', WebkitTapHighlightColor: 'transparent' },
};

export const buildTheme = (dark: boolean) =>
  createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: { main: dark ? '#0a84ff' : '#007aff' },
      success: { main: dark ? '#30d158' : '#34c759' },
      error: { main: dark ? '#ff453a' : '#ff3b30' },
      background: { default: dark ? '#000000' : '#f2f2f7', paper: dark ? '#1c1c1e' : '#ffffff' },
    },
    shape: { borderRadius: 14 },
    typography: { fontFamily: FONT, button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 } },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 28, backgroundImage: 'none', backgroundColor: 'var(--glass)', backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)' },
        },
      },
      // Переключатель в стиле iOS
      MuiSwitch: {
        styleOverrides: {
          root: { width: 51, height: 31, padding: 0 },
          switchBase: { padding: 2, color: '#fff', '&.Mui-checked': { transform: 'translateX(20px)', color: '#fff', '& + .MuiSwitch-track': { backgroundColor: 'var(--green)', opacity: 1 } } },
          thumb: { width: 27, height: 27, boxShadow: '0 2px 4px rgba(0,0,0,0.25)' },
          track: { borderRadius: 16, backgroundColor: 'rgba(120,120,128,0.32)', opacity: 1 },
        },
      },
    },
  });
