import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  paper: '#F4EBDC',
  paperSoft: '#FBF6EC',
  paperDeep: '#E8DAC4',
  paperDark: '#D6C2A7',
  ink: '#1D1A16',
  inkSoft: '#39342C',
  muted: '#766B5C',
  faint: '#A99B87',
  line: '#D9CBB5',
  lineStrong: '#C7B392',
  oxblood: '#9A2E26',
  oxbloodDark: '#6E1713',
  oxbloodSoft: '#B6493A',
  gold: '#B9904A',
  goldSoft: '#DCC58F',
  black: '#0E0D0B',
  white: '#FFFDF7',
  success: '#3B7651',
  warning: '#A86E25',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.paper,
    backgroundElement: Palette.paperSoft,
    backgroundSelected: Palette.paperDeep,
    textSecondary: Palette.muted,
  },
  dark: {
    text: Palette.paperSoft,
    background: Palette.black,
    backgroundElement: '#181512',
    backgroundSelected: '#251F19',
    textSecondary: Palette.paperDark,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    display: 'AvenirNextCondensed-Heavy',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: Platform.select({ android: 'sans-serif', default: 'System' }),
    display: Platform.select({ android: 'sans-serif-condensed', default: 'System' }),
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans)',
    display: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  seven: 80,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 520;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  round: 999,
} as const;

export const Shadow = {
  soft: {
    shadowColor: Palette.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  strong: {
    shadowColor: Palette.black,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;
