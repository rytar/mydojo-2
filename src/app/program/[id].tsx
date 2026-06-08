import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, CheckCircle2, ShieldCheck, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/mydojo/layout';
import { Avatar, Card, DojoButton, Pill, ScoreRing, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { getProgram } from '@/services/programs';
import { listProgramReviews } from '@/services/reviews';
import type { Program, Review } from '@/types/mydojo';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [purchased, setPurchased] = useState(id === 'beginner-strong');
  const [program, setProgram] = useState<Program | null>(null);
  const [programReviews, setProgramReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      return;
    }

    getProgram(id)
      .then(async (item) => {
        if (!item) {
          throw new Error('Programme introuvable.');
        }

        const nextReviews = await listProgramReviews(item.backendId ?? item.id);

        if (!cancelled) {
          setProgram(item);
          setProgramReviews(nextReviews);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Impossible de charger ce programme.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !program) {
    return (
      <Screen>
        <View style={styles.loadingState}>
          <Pressable onPress={() => router.back()} style={styles.roundIconLight}>
            <ArrowLeft color={Palette.ink} size={22} />
          </Pressable>
          <DisplayText style={styles.loadingTitle}>Programme</DisplayText>
          <BodyText color={Palette.muted}>
            {loadError ?? 'Chargement de la fiche programme...'}
          </BodyText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Image
          source={program.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="right center"
        />
        <LinearGradient
          colors={['rgba(14,13,11,0.92)', 'rgba(14,13,11,0.44)', 'rgba(14,13,11,0.1)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroTop}>
          <Pressable onPress={() => router.back()} style={styles.roundIcon}>
            <ArrowLeft color={Palette.paperSoft} size={22} />
          </Pressable>
          <Pressable style={styles.roundIcon}>
            <Bookmark color={Palette.paperSoft} size={21} />
          </Pressable>
        </View>
        <View style={styles.heroBottom}>
          <Pill active>{program.category}</Pill>
          <DisplayText color={Palette.paperSoft} style={styles.heroTitle}>
            {program.title}
          </DisplayText>
          <BodyText color={Palette.goldSoft}>{program.description}</BodyText>
        </View>
      </View>

      <Card style={styles.summaryCard}>
        <ScoreRing score={program.score} size={74} />
        <View style={{ flex: 1 }}>
          <LabelText color={Palette.oxblood}>Score algorithmique</LabelText>
          <BodyText>
            Avis, complétion, signalements et rang créateur déterminent la visibilité.
          </BodyText>
        </View>
      </Card>

      <Card style={styles.creatorCard}>
        <Avatar label={program.creator.avatar} />
        <View style={{ flex: 1 }}>
          <BodyText style={styles.creatorName}>{program.creator.name}</BodyText>
          <LabelText>{program.creator.rank} · {program.creator.specialty}</LabelText>
        </View>
        {program.creator.verified && <ShieldCheck color={Palette.gold} size={24} />}
      </Card>

      <View style={styles.metricsGrid}>
        <Metric label="Durée" value={`${program.durationWeeks} sem.`} />
        <Metric label="Rythme" value={`${program.sessionsPerWeek}x/sem.`} />
        <Metric label="Séance" value={`${program.averageMinutes} min`} />
        <Metric label="Élèves" value={program.students} />
      </View>

      <Card style={styles.descriptionCard}>
        <LabelText color={Palette.oxblood}>Aperçu</LabelText>
        <BodyText>{program.longDescription}</BodyText>
        <View style={styles.moduleWrap}>
          {program.modules.map((module) => (
            <View key={module} style={styles.modulePill}>
              <LabelText>{module}</LabelText>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Avis utiles" action={`${program.reviewCount} avis`} />
      {programReviews.length ? (
        programReviews.map((review) => (
          <Card key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Avatar label={review.author.slice(0, 1)} size={34} />
              <View style={{ flex: 1 }}>
                <BodyText style={styles.creatorName}>{review.author}</BodyText>
                <LabelText>{review.rank}</LabelText>
              </View>
              <View style={styles.rating}>
                <Star color={Palette.gold} fill={Palette.gold} size={15} />
                <BodyText style={styles.creatorName}>{review.rating}</BodyText>
              </View>
            </View>
            <BodyText>{review.body}</BodyText>
            <View style={styles.reviewBottom}>
              {review.completed && <CheckCircle2 color={Palette.success} size={16} />}
              <LabelText>{review.helpful} personnes l’ont trouvé utile</LabelText>
            </View>
          </Card>
        ))
      ) : (
        <Card style={styles.reviewCard}>
          <BodyText>Les premiers avis qualifiés apparaîtront après complétion du programme.</BodyText>
        </Card>
      )}

      <Card style={styles.algorithmCard}>
        <LabelText color={Palette.oxblood}>Pourquoi il est classé ici</LabelText>
        <Signal label="Complétion" value={program.algorithmSignals.completion} />
        <Signal label="Qualité des avis" value={program.algorithmSignals.reviewQuality} />
        <Signal label="Boost créateur" value={program.algorithmSignals.creatorBoost * 10} />
        <Signal label="Signalements" value={Math.max(4, 100 - program.algorithmSignals.reports * 8)} />
      </Card>

      <View style={styles.ctaBar}>
        <View>
          <LabelText>Accès MVP</LabelText>
          <DisplayText style={styles.price}>{program.priceLabel}</DisplayText>
        </View>
        <DojoButton
          icon={purchased ? 'check' : 'arrow'}
          style={styles.buyButton}
          onPress={() => setPurchased(true)}>
          {purchased ? 'Débloqué' : 'Achat simulé'}
        </DojoButton>
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.metricCard}>
      <LabelText>{label}</LabelText>
      <BodyText style={styles.metricValue}>{value}</BodyText>
    </Card>
  );
}

function Signal({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.signal}>
      <View style={styles.signalTop}>
        <BodyText>{label}</BodyText>
        <LabelText>{value}/100</LabelText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 330,
    marginHorizontal: -Spacing.three,
    marginTop: -Spacing.two,
    backgroundColor: Palette.black,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(14,13,11,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.16)',
  },
  heroBottom: {
    gap: Spacing.two,
  },
  heroTitle: {
    fontSize: 48,
    lineHeight: 49,
  },
  summaryCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  creatorCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  creatorName: {
    fontWeight: '900',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metricCard: {
    width: '48%',
    padding: Spacing.three,
  },
  metricValue: {
    marginTop: Spacing.one,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  descriptionCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  moduleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  modulePill: {
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Palette.line,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  reviewCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  algorithmCard: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  signal: {
    gap: Spacing.one,
  },
  signalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 7,
    borderRadius: Radius.round,
    backgroundColor: Palette.paperDark,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Palette.oxblood,
  },
  ctaBar: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.lineStrong,
    backgroundColor: Palette.paperSoft,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  price: {
    fontSize: 36,
    lineHeight: 38,
  },
  buyButton: {
    flex: 1,
  },
  loadingState: {
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  roundIconLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,253,247,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  loadingTitle: {
    fontSize: 52,
    lineHeight: 53,
  },
});
