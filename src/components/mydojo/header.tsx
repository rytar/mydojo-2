import { Image } from 'expo-image';
import { Bell, Menu } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar } from '@/components/mydojo/primitives';
import { Palette, Radius } from '@/constants/theme';

type AppHeaderProps = {
  avatarLabel?: string;
  left?: 'menu' | 'bell';
};

export function AppHeader({ avatarLabel = 'A', left = 'menu' }: AppHeaderProps) {
  const LeftIcon = left === 'bell' ? Bell : Menu;

  return (
    <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
      <Pressable style={styles.iconButton}>
        <LeftIcon color={Palette.ink} size={21} strokeWidth={1.9} />
      </Pressable>

      <View style={styles.brand}>
        <Image
          source={require('@/assets/images/brand/mydojo-mark.png')}
          style={styles.logoMark}
          contentFit="contain"
        />
        <Image
          source={require('@/assets/images/brand/mydojo-wordmark.png')}
          style={styles.wordmark}
          contentFit="contain"
        />
      </View>

      <Avatar label={avatarLabel} size={38} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,247,0.36)',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  logoMark: {
    width: 23,
    height: 23,
  },
  wordmark: {
    width: 110,
    height: 16,
  },
});
