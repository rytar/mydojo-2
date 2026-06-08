import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Edge[];
};

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottom = insets.bottom + Spacing.four;

  const content = (
    <View style={[styles.content, { paddingBottom: bottom }, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <PaperTexture />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function PaperTexture() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['rgba(255,255,255,0.58)', 'rgba(154,46,38,0.03)', 'rgba(185,144,74,0.08)']}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.noiseOne} />
      <View style={styles.noiseTwo} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.paper,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Platform.select({ web: Spacing.three, default: Spacing.two }),
    gap: Spacing.three,
  },
  noiseOne: {
    position: 'absolute',
    top: 90,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(185, 144, 74, 0.08)',
  },
  noiseTwo: {
    position: 'absolute',
    top: 280,
    left: -60,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(29, 26, 22, 0.04)',
  },
});
