import { Box, ButtonBase } from '@mui/material';
import Backspace from '@mui/icons-material/BackspaceOutlined';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '⌫'];

interface Props { disabled: boolean; onPress: (key: string) => void }

/** Круглые клавиши, как на клавиатуре телефона в iOS. На телефоне размер подстраивается под высоту экрана. */
export function Keypad({ disabled, onPress }: Props) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'center', gap: { xs: 'clamp(8px, 1.6vh, 14px) 22px', md: '12px 16px' }, pt: { xs: 1, md: 2.5 }, pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 8px)', md: 2.5 } }}>
      {KEYS.map((k) => (
        <ButtonBase key={k} disabled={disabled} onClick={() => onPress(k)} aria-label={k === '⌫' ? 'Стереть' : k}
          sx={{ width: { xs: 'clamp(52px, 9.5vh, 78px)', md: 68 }, height: { xs: 'clamp(52px, 9.5vh, 78px)', md: 68 }, borderRadius: '50%', fontSize: { xs: 'clamp(26px, 4.5vh, 34px)', md: 28 }, fontWeight: 300, color: 'var(--label)', bgcolor: k === '⌫' ? 'transparent' : 'var(--fill)', transition: 'filter .1s', '&:active': { filter: 'brightness(0.85)' }, '&.Mui-disabled': { color: 'var(--secondary)' } }}>
          {k === '⌫' ? <Backspace fontSize="large" /> : k === '-' ? '−' : k}
        </ButtonBase>
      ))}
    </Box>
  );
}
