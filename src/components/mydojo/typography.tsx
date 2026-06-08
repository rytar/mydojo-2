import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { Fonts, Palette } from '@/constants/theme';

type TextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  numberOfLines?: number;
};

export function DisplayText({ children, style, color = Palette.ink, numberOfLines }: TextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.display, { color }, style]}>
      {children}
    </Text>
  );
}

export function BodyText({ children, style, color = Palette.inkSoft, numberOfLines }: TextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.body, { color }, style]}>
      {children}
    </Text>
  );
}

export function LabelText({ children, style, color = Palette.muted, numberOfLines }: TextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.label, { color }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.display,
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: 0,
    textTransform: 'uppercase',
    fontWeight: Platform.select({ web: '800', default: '700' }),
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
});
