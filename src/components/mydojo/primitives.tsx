import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { BodyText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'dark';
  style?: StyleProp<ViewStyle>;
  icon?: 'arrow' | 'check' | 'none';
};

export function DojoButton({
  children,
  onPress,
  variant = 'primary',
  style,
  icon = 'arrow',
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const iconColor = isPrimary || variant === 'dark' ? Palette.paperSoft : Palette.ink;
  const content = (
    <>
      <BodyText color={iconColor} style={styles.buttonText}>
        {children}
      </BodyText>
      {icon === 'arrow' && <ChevronRight size={18} color={iconColor} />}
      {icon === 'check' && <Check size={18} color={iconColor} />}
    </>
  );

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, style]}>
      {isPrimary ? (
        <LinearGradient
          colors={[Palette.oxbloodSoft, Palette.oxblood, Palette.oxbloodDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, variant === 'dark' ? styles.darkButton : styles.ghostButton]}>
          {content}
        </View>
      )}
    </Pressable>
  );
}

type PillProps = {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
};

export function Pill({ children, active, onPress }: PillProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pillPressable, pressed && styles.pressed]}>
      <View style={[styles.pill, active && styles.pillActive]}>
        <LabelText color={active ? Palette.paperSoft : Palette.muted}>{children}</LabelText>
      </View>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Avatar({ label, size = 42 }: { label: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <LabelText color={Palette.paperSoft} style={{ fontSize: Math.max(10, size * 0.26) }}>
        {label}
      </LabelText>
    </View>
  );
}

export function ScoreRing({ score, size = 60 }: { score: number; size?: number }) {
  return (
    <View style={[styles.score, { width: size, height: size, borderRadius: size / 2 }]}>
      <BodyText color={Palette.ink} style={[styles.scoreNumber, { fontSize: size * 0.34 }]}>
        {score}
      </BodyText>
      <LabelText style={{ letterSpacing: 0, fontSize: size * 0.13 }}>/100</LabelText>
    </View>
  );
}

export function SectionHeader({
  title,
  action = 'Voir tout',
}: {
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrap}>
        <View style={styles.sectionMark} />
        <LabelText color={Palette.ink} style={styles.sectionTitle}>
          {title}
        </LabelText>
      </View>
      <View style={styles.sectionAction}>
        <LabelText>{action}</LabelText>
        <ChevronRight size={16} color={Palette.muted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.76,
  },
  pillPressable: {
    alignSelf: 'flex-start',
  },
  button: {
    minHeight: 42,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  ghostButton: {
    backgroundColor: 'rgba(255, 253, 247, 0.54)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  darkButton: {
    backgroundColor: Palette.black,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  pill: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,253,247,0.42)',
  },
  pillActive: {
    backgroundColor: Palette.oxblood,
    borderColor: Palette.oxblood,
  },
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255, 253, 247, 0.58)',
    overflow: 'hidden',
    ...Shadow.soft,
  },
  avatar: {
    backgroundColor: Palette.black,
    borderWidth: 2,
    borderColor: Palette.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    borderWidth: 2,
    borderColor: Palette.gold,
    backgroundColor: 'rgba(255, 253, 247, 0.76)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    lineHeight: 24,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionMark: {
    width: 3,
    height: 22,
    backgroundColor: Palette.oxblood,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: 0,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
