/** Ширина центральной колонки на больших экранах. */
export const COLUMN = 680;
/** Высота верхней панели с переключателем режимов (с учётом «чёлки» iPhone). */
export const MODE_BAR_HEIGHT = 'calc(52px + env(safe-area-inset-top, 0px))';
/** Первый экран на телефоне: ровно высота окна за вычетом переключателя режимов. */
export const heroSx = {
  height: `calc(100vh - ${MODE_BAR_HEIGHT})`,
  '@supports (height: 100dvh)': { height: `calc(100dvh - ${MODE_BAR_HEIGHT})` },
  display: 'flex',
  flexDirection: 'column',
} as const;
