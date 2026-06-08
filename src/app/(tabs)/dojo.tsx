import { CheckCircle2, Clock3, Flame, PlayCircle } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppHeader } from '@/components/mydojo/header';
import { Screen } from '@/components/mydojo/layout';
import { ProgramCard } from '@/components/mydojo/program-card';
import { Card, DojoButton, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { currentUser, programs } from '@/data/mydojo';

export default function DojoScreen() {
  const activeProgram = programs[0];

  return (
    <Screen>
      <AppHeader avatarLabel={currentUser.avatar} left="bell" />

      <Animated.View entering={FadeInDown.delay(70).duration(430)} style={styles.summaryPanel}>
        <View>
          <LabelText color={Palette.oxblood}>Aujourd’hui</LabelText>
          <DisplayText style={styles.title}>Mon Dojo</DisplayText>
          <BodyText color={Palette.muted} style={styles.summaryText}>
            Une séance courte, une décision claire, une progression visible.
          </BodyText>
        </View>
        <View style={styles.summaryStats}>
          <MiniStat label="Série" value="3j" />
          <MiniStat label="Score" value={`${currentUser.dojoScore}`} />
          <MiniStat label="Focus" value="Force" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(130).duration(460)}>
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View>
            <LabelText color={Palette.goldSoft}>Séance 2 / 12 · en cours</LabelText>
            <DisplayText color={Palette.paperSoft} style={styles.sessionTitle}>
              Beginner Strong
            </DisplayText>
          </View>
          <PlayCircle color={Palette.goldSoft} size={40} />
        </View>
        <View style={styles.workoutBox}>
          <View style={styles.exerciseHeader}>
            <View>
              <LabelText color={Palette.paperDark}>Exercice 1 / 4</LabelText>
              <DisplayText style={styles.exerciseTitle}>Squat</DisplayText>
            </View>
            <View style={styles.setBadge}>
              <LabelText color={Palette.paperSoft}>2/4</LabelText>
            </View>
          </View>
          <BodyText color={Palette.paperDeep}>4 séries · 8 reps · 60 kg cible</BodyText>
          <View style={styles.metricRow}>
            <Metric icon={<Clock3 size={18} color={Palette.goldSoft} />} label="Repos" value="01:15" />
            <Metric icon={<Flame size={18} color={Palette.goldSoft} />} label="Intensité" value="RPE 7" />
          </View>
          <DojoButton icon="check">Valider la série</DojoButton>
        </View>
      </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(190).duration(460)} style={styles.progressStrip}>
        <LabelText>Progression</LabelText>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <BodyText style={styles.progressText}>2 / 4 exercices terminés</BodyText>
      </Animated.View>

      <SectionHeader title="Tes protocoles" action="Gérer" />
      <ProgramCard program={activeProgram} />

      <Card style={styles.checklist}>
        <LabelText color={Palette.oxblood}>Signal qualité</LabelText>
        {['Créateur vérifié boosté', 'Avis complétés valorisés', 'Signalements pénalisants'].map(
          (item) => (
            <View key={item} style={styles.checkRow}>
              <CheckCircle2 size={18} color={Palette.success} />
              <BodyText>{item}</BodyText>
            </View>
          ),
        )}
      </Card>
    </Screen>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <LabelText>{label}</LabelText>
      <BodyText style={styles.miniStatValue}>{value}</BodyText>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      {icon}
      <View>
        <LabelText color={Palette.paperDark}>{label}</LabelText>
        <BodyText color={Palette.paperSoft} style={styles.metricValue}>
          {value}
        </BodyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryPanel: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,253,247,0.52)',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    fontSize: 38,
    lineHeight: 40,
  },
  summaryText: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  miniStat: {
    flex: 1,
    minHeight: 58,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: Spacing.two,
    justifyContent: 'center',
    backgroundColor: 'rgba(244,235,220,0.66)',
  },
  miniStatValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  sessionCard: {
    backgroundColor: Palette.black,
    borderColor: 'rgba(185,144,74,0.4)',
    padding: 14,
    gap: 14,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  sessionTitle: {
    fontSize: 28,
    lineHeight: 30,
  },
  workoutBox: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,253,247,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.12)',
    padding: 14,
    gap: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  exerciseTitle: {
    color: Palette.paperSoft,
    fontSize: 42,
    lineHeight: 42,
  },
  setBadge: {
    minWidth: 44,
    minHeight: 34,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.oxblood,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  metricValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },
  progressStrip: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: Spacing.three,
    backgroundColor: 'rgba(255,253,247,0.48)',
    gap: Spacing.two,
  },
  progressTrack: {
    height: 7,
    borderRadius: Radius.round,
    backgroundColor: Palette.paperDark,
    overflow: 'hidden',
  },
  progressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: Palette.oxblood,
  },
  progressText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  checklist: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
