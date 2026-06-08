import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';

import { Avatar, Card } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { Program } from '@/types/mydojo';

type ProgramCardProps = {
  program: Program;
  featured?: boolean;
  compact?: boolean;
  rank?: number;
};

type ProgramVisual = {
  label: string;
  accent: string;
  soft: string;
  glow: string;
};

type MetricKind = 'weeks' | 'sessions' | 'time';

export function ProgramCard({ program, featured, compact, rank }: ProgramCardProps) {
  const openProgram = () => router.push({ pathname: '/program/[id]', params: { id: program.id } });
  const visual = visualForProgram(program);
  const level = labelForDifficulty(program.difficulty);
  const showLevel = !isDuplicateLevel(program, visual.label);

  if (featured) {
    return (
      <Animated.View entering={FadeInDown.delay(120).duration(460)}>
        <Pressable onPress={openProgram} style={({ pressed }) => [pressed && styles.pressed]}>
          <View style={styles.featured}>
            <Image
              source={program.image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="right center"
            />
            <LinearGradient
              colors={['rgba(14,13,11,0.9)', 'rgba(14,13,11,0.52)', 'rgba(14,13,11,0.08)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.featuredGlow, { backgroundColor: visual.glow }]} />

            <View style={styles.featuredContent}>
              <View style={styles.featuredTop}>
                <View style={styles.identityRow}>
                  <DomainBadge domain={program.domain} visual={visual} contrast />
                  {showLevel && <LevelBadge label={level} contrast />}
                </View>
                <ProgramScore score={program.score} contrast />
              </View>

              <View style={styles.featuredBottom}>
                <View>
                  <DisplayText color={Palette.paperSoft} style={styles.featuredTitle}>
                    {program.title}
                  </DisplayText>
                  <BodyText color={Palette.paperSoft} style={styles.featuredDescription} numberOfLines={2}>
                    {program.description}
                  </BodyText>
                </View>

                <View style={styles.featuredStats}>
                  <MetricPill kind="weeks" label={`${program.durationWeeks} sem.`} contrast />
                  <MetricPill kind="sessions" label={`${program.sessionsPerWeek}x/sem.`} contrast />
                  <MetricPill kind="time" label={`${program.averageMinutes} min`} contrast />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // ── COMPACT (App Store list style) ────────────────────────
  if (compact) {
    return (
      <Animated.View entering={FadeInDown.delay((rank ?? 1) * 60).duration(400)}>
        <Pressable
          onPress={openProgram}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          {rank !== undefined && (
            <LabelText color={Palette.faint} style={styles.rowRank}>
              {rank}
            </LabelText>
          )}
          <View style={styles.rowThumb}>
            <Image
              source={program.image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="center"
            />
            <LinearGradient
              colors={['rgba(14,13,11,0)', 'rgba(14,13,11,0.22)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.rowAccentBar, { backgroundColor: visual.accent }]} />
          </View>
          <View style={styles.rowInfo}>
            <View style={styles.rowTitleLine}>
              <DisplayText style={styles.rowTitle} numberOfLines={1}>
                {program.title}
              </DisplayText>
              {program.creator.verified && <VerifiedMark color={Palette.gold} />}
            </View>
            <View style={styles.rowMeta}>
              <StarRating rating={program.rating} />
              <LabelText style={styles.rowRatingCount}>
                {program.reviewCount >= 1000
                  ? `${(program.reviewCount / 1000).toFixed(1)}k`
                  : program.reviewCount}
              </LabelText>
              <View style={styles.rowDot} />
              <DomainBadge domain={program.domain} visual={visual} />
            </View>
            <LabelText numberOfLines={1}>
              {program.creator.name} · {program.priceLabel}
            </LabelText>
          </View>
          <View style={[styles.rowCta, { borderColor: visual.accent + '66' }]}>
            <LabelText color={visual.accent} style={styles.rowCtaText}>
              Voir
            </LabelText>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(90).duration(420)}>
      <Pressable onPress={openProgram} style={({ pressed }) => [pressed && styles.pressed]}>
        <Card style={[styles.card, { borderColor: visual.soft }]}>
          <View style={styles.cover}>
            <Image
              source={program.image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="center"
            />
            <LinearGradient
              colors={['rgba(14,13,11,0.04)', 'rgba(14,13,11,0.16)', 'rgba(14,13,11,0.72)']}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.coverTop}>
              <DomainBadge domain={program.domain} visual={visual} contrast />
              <ProgramScore score={program.score} contrast />
            </View>
            <View style={styles.coverBottom}>
              {showLevel && <LevelBadge label={level} contrast />}
              <DisplayText color={Palette.paperSoft} style={styles.coverTitle} numberOfLines={1}>
                {program.title}
              </DisplayText>
            </View>
          </View>

          <View style={styles.cardBody}>
            <BodyText color={Palette.muted} style={styles.description} numberOfLines={2}>
              {program.description}
            </BodyText>

            <View style={styles.metaRow}>
              <MetricPill kind="weeks" label={`${program.durationWeeks} sem.`} />
              <MetricPill kind="sessions" label={`${program.sessionsPerWeek}x`} />
              <MetricPill kind="time" label={`${program.averageMinutes} min`} />
            </View>

            <View style={styles.divider} />

            <View style={styles.creatorRow}>
              <Avatar label={program.creator.avatar} size={30} />
              <View style={styles.creatorCopy}>
                <BodyText style={styles.creatorName} numberOfLines={1}>
                  {program.creator.name}
                </BodyText>
                <LabelText numberOfLines={1}>{creatorRankLabel(program.creator.rank)}</LabelText>
              </View>
              {program.creator.verified && <VerifiedMark color={Palette.gold} />}
              <View style={[styles.compactAction, { backgroundColor: visual.accent }]}>
                <ArrowMark color={Palette.paperSoft} />
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

function DomainBadge({
  domain,
  visual,
  contrast,
}: {
  domain: Program['domain'];
  visual: ProgramVisual;
  contrast?: boolean;
}) {
  return (
    <View
      style={[
        styles.domainBadge,
        {
          backgroundColor: contrast ? 'rgba(14,13,11,0.52)' : visual.soft,
          borderColor: contrast ? 'rgba(255,253,247,0.22)' : visual.soft,
        },
      ]}>
      <DomainMon domain={domain} color={contrast ? Palette.goldSoft : visual.accent} size={14} />
      <LabelText color={contrast ? Palette.paperSoft : visual.accent} style={styles.badgeLabel} numberOfLines={1}>
        {visual.label}
      </LabelText>
    </View>
  );
}

function LevelBadge({ label, contrast }: { label: string; contrast?: boolean }) {
  return (
    <View style={[styles.levelBadge, contrast && styles.levelBadgeContrast]}>
      <LabelText color={contrast ? Palette.paperSoft : Palette.muted} style={styles.badgeLabel} numberOfLines={1}>
        {label}
      </LabelText>
    </View>
  );
}

function ProgramScore({ score, contrast }: { score: number; contrast?: boolean }) {
  return (
    <View style={[styles.scoreBadge, contrast && styles.scoreBadgeContrast]}>
      <BodyText color={contrast ? Palette.paperSoft : Palette.ink} style={styles.scoreValue}>
        {score}
      </BodyText>
      <LabelText color={contrast ? Palette.goldSoft : Palette.muted} style={styles.scoreLabel}>
        score
      </LabelText>
    </View>
  );
}

function MetricPill({ kind, label, contrast }: { kind: MetricKind; label: string; contrast?: boolean }) {
  return (
    <View style={[styles.metaPill, contrast && styles.metaPillContrast]}>
      <MetricMon kind={kind} color={contrast ? Palette.goldSoft : Palette.muted} />
      <LabelText color={contrast ? Palette.paperSoft : Palette.muted} style={styles.metaText} numberOfLines={1}>
        {label}
      </LabelText>
    </View>
  );
}

function DomainMon({ domain, color, size = 18 }: { domain: Program['domain']; color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {domain === 'force' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Circle cx={7} cy={7} r={2.2} />
          <Circle cx={17} cy={7} r={2.2} />
          <Circle cx={7} cy={17} r={2.2} />
          <Circle cx={17} cy={17} r={2.2} />
          <Path d="M9 7h6M9 17h6M7 9v6M17 9v6M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
        </G>
      )}
      {domain === 'perte-de-gras' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Path d="M12 3c2.8 3 6 5.9 6 10.1A6 6 0 0 1 6 13c0-2.4 1.2-4.2 3-5.9-.1 2.4.8 3.8 2.3 4.7-.4-3 .1-5.8.7-8.8Z" />
          <Path d="M12.2 14.2c1.3 1 2.1 2 2.1 3.2a2.4 2.4 0 0 1-4.8 0c0-1 .8-2.1 2.7-3.2Z" />
        </G>
      )}
      {domain === 'mobilite' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeWidth={2}>
          <Path d="M3.5 9.5c3.8-4 7.1-4 10 0s5.6 4 7 0" />
          <Path d="M3.5 15c3.3-3.1 6.2-3.1 8.8 0s5.6 3.1 8.2 0" />
          <Circle cx={12} cy={12} r={8.5} strokeOpacity={0.35} />
        </G>
      )}
      {domain === 'nutrition' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Path d="M5 13c.8 5.1 4.2 7 7 7s6.2-1.9 7-7H5Z" />
          <Path d="M8 10c.4-3.8 3.1-5.4 7.8-6-.7 4.8-2.5 7.2-6 7.2" />
          <Path d="M12 13c.7-2.1 2.1-3.5 4.5-4.3" />
        </G>
      )}
      {domain === 'mindset' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeWidth={2}>
          <Path d="M4.5 12a7.5 7.5 0 0 1 15 0c0 4.8-4.3 7-7.5 7" />
          <Path d="M12 5v14M8.2 9.5h7.6M7.5 14.2h9" />
          <Circle cx={12} cy={12} r={2.1} fill={color} stroke="none" />
        </G>
      )}
      {domain === 'discipline' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Path d="M12 3 21 12l-9 9-9-9 9-9Z" />
          <Path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" />
          <Circle cx={12} cy={12} r={1.5} fill={color} stroke="none" />
        </G>
      )}
    </Svg>
  );
}

function MetricMon({ kind, color }: { kind: MetricKind; color: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      {kind === 'weeks' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Rect x={4} y={5.5} width={16} height={14} rx={3} />
          <Path d="M8 3.5v4M16 3.5v4M4 10h16" />
        </G>
      )}
      {kind === 'sessions' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Path d="M5 12h14M8 8v8M16 8v8" />
          <Circle cx={5} cy={12} r={1.8} />
          <Circle cx={19} cy={12} r={1.8} />
        </G>
      )}
      {kind === 'time' && (
        <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <Circle cx={12} cy={12} r={8} />
          <Path d="M12 7.5V12l3.2 2.1" />
        </G>
      )}
    </Svg>
  );
}

function VerifiedMark({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <Path d="M12 3.5 19 6v5.2c0 4.1-2.7 7.7-7 9.3-4.3-1.6-7-5.2-7-9.3V6l7-2.5Z" />
        <Path d="m8.5 12.2 2.2 2.2 4.8-5" />
      </G>
    </Svg>
  );
}

function ArrowMark({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4}>
        <Path d="M8 5.5 14.5 12 8 18.5" />
      </G>
    </Svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.4;
  return (
    <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Svg key={i} width={10} height={10} viewBox="0 0 24 24">
          <Polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i <= full ? Palette.gold : i === full + 1 && hasHalf ? Palette.goldSoft : Palette.line}
            stroke={Palette.goldSoft}
            strokeWidth={0.5}
          />
        </Svg>
      ))}
    </View>
  );
}

function visualForProgram(program: Program): ProgramVisual {
  const byDomain: Record<Program['domain'], ProgramVisual> = {
    force: {
      label: 'Force',
      accent: Palette.oxblood,
      soft: 'rgba(154,46,38,0.12)',
      glow: 'rgba(154,46,38,0.18)',
    },
    'perte-de-gras': {
      label: 'Perte de gras',
      accent: Palette.warning,
      soft: 'rgba(168,110,37,0.14)',
      glow: 'rgba(168,110,37,0.18)',
    },
    mobilite: {
      label: 'Mobilité',
      accent: Palette.success,
      soft: 'rgba(59,118,81,0.14)',
      glow: 'rgba(59,118,81,0.16)',
    },
    nutrition: {
      label: 'Nutrition',
      accent: Palette.gold,
      soft: 'rgba(185,144,74,0.16)',
      glow: 'rgba(185,144,74,0.18)',
    },
    mindset: {
      label: 'Mindset',
      accent: Palette.inkSoft,
      soft: 'rgba(57,52,44,0.12)',
      glow: 'rgba(57,52,44,0.16)',
    },
    discipline: {
      label: program.category,
      accent: Palette.oxbloodDark,
      soft: 'rgba(110,23,19,0.12)',
      glow: 'rgba(110,23,19,0.18)',
    },
  };

  return byDomain[program.domain];
}

function labelForDifficulty(difficulty: Program['difficulty']) {
  if (difficulty === 'debutant') {
    return 'Débutant';
  }

  if (difficulty === 'intermediaire') {
    return 'Inter.';
  }

  return 'Avancé';
}

function isDuplicateLevel(program: Program, label: string) {
  return program.difficulty === 'avance' && normalizeLabel(label) === 'avance';
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function creatorRankLabel(rank: Program['creator']['rank']) {
  if (rank === 'sensei verifie') {
    return 'Sensei';
  }

  if (rank === 'coach pro') {
    return 'Coach pro';
  }

  if (rank === 'createur emergent') {
    return 'Créateur';
  }

  return 'Membre';
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
  },
  featured: {
    minHeight: 204,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Palette.black,
  },
  featuredGlow: {
    position: 'absolute',
    left: -54,
    bottom: -48,
    width: 164,
    height: 164,
    borderRadius: 82,
  },
  featuredContent: {
    flex: 1,
    padding: Spacing.three,
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  featuredBottom: {
    gap: Spacing.three,
  },
  featuredTitle: {
    fontSize: 36,
    lineHeight: 36,
    maxWidth: 220,
  },
  featuredDescription: {
    marginTop: 6,
    maxWidth: 246,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  featuredStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    backgroundColor: 'rgba(255,253,247,0.74)',
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 10,
    overflow: 'hidden',
    backgroundColor: Palette.paperDeep,
    justifyContent: 'space-between',
    padding: Spacing.two,
  },
  coverTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  coverBottom: {
    gap: 6,
    alignItems: 'flex-start',
  },
  coverTitle: {
    fontSize: 26,
    lineHeight: 27,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.line,
    marginVertical: 2,
  },
  cardBody: {
    padding: Spacing.three,
    gap: 10,
  },
  identityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  domainBadge: {
    minHeight: 25,
    maxWidth: '100%',
    borderRadius: Radius.round,
    borderWidth: 1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  levelBadge: {
    minHeight: 25,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,253,247,0.52)',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  levelBadgeContrast: {
    borderColor: 'rgba(255,253,247,0.22)',
    backgroundColor: 'rgba(14,13,11,0.42)',
  },
  badgeLabel: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
  },
  scoreBadge: {
    width: 43,
    minHeight: 47,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.lineStrong,
    backgroundColor: 'rgba(255,253,247,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeContrast: {
    borderColor: 'rgba(220,197,143,0.42)',
    backgroundColor: 'rgba(14,13,11,0.46)',
  },
  scoreValue: {
    fontSize: 18,
    lineHeight: 19,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaPill: {
    minHeight: 26,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Palette.line,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,253,247,0.48)',
  },
  metaPillContrast: {
    borderColor: 'rgba(255,253,247,0.18)',
    backgroundColor: 'rgba(14,13,11,0.34)',
  },
  metaText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  creatorCopy: {
    flex: 1,
    minWidth: 0,
  },
  creatorName: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  compactAction: {
    width: 31,
    height: 31,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Compact row (App Store style) ── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    backgroundColor: 'transparent',
  },
  rowRank: {
    width: 18,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 0,
  },
  rowThumb: {
    width: 66,
    height: 66,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Palette.paperDeep,
    flexShrink: 0,
  },
  rowAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    opacity: 0.72,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowTitle: {
    fontSize: 15,
    lineHeight: 16,
    flex: 1,
    minWidth: 0,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowRatingCount: {
    fontSize: 10,
    letterSpacing: 0,
  },
  rowDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Palette.line,
  },
  rowCta: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: Radius.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowCtaText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
