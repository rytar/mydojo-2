import { BookmarkCheck, Medal, ShieldCheck, Star } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/mydojo/layout';
import { Avatar, Card, DojoButton, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Spacing } from '@/constants/theme';
import { currentUser, programs } from '@/data/mydojo';

export default function ProfileScreen() {
  const purchased = programs.filter((program) => currentUser.purchased.includes(program.id));

  return (
    <Screen>
      <Card style={styles.profileHero}>
        <Avatar label={currentUser.avatar} size={76} />
        <View style={{ flex: 1 }}>
          <LabelText color={Palette.gold}>Profil utilisateur</LabelText>
          <DisplayText color={Palette.paperSoft} style={styles.name}>
            {currentUser.name}
          </DisplayText>
          <BodyText color={Palette.paperDeep}>Rang : {currentUser.rank}</BodyText>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Stat icon={<Medal color={Palette.gold} size={24} />} value={`${currentUser.dojoScore}`} label="Dojo score" />
        <Stat icon={<Star color={Palette.gold} size={24} />} value={`${currentUser.streak}`} label="Jours série" />
        <Stat icon={<BookmarkCheck color={Palette.oxblood} size={24} />} value="1" label="Accès" />
      </View>

      <SectionHeader title="Objectifs" action="Modifier" />
      <Card style={styles.goals}>
        {currentUser.goals.map((goal) => (
          <View key={goal} style={styles.goalRow}>
            <ShieldCheck color={Palette.success} size={18} />
            <BodyText>{goal}</BodyText>
          </View>
        ))}
      </Card>

      <SectionHeader title="Programmes débloqués" action="Voir" />
      {purchased.map((program) => (
        <Card key={program.id} style={styles.purchaseCard}>
          <View style={{ flex: 1 }}>
            <LabelText color={Palette.oxblood}>{program.category}</LabelText>
            <DisplayText style={styles.programTitle}>{program.title}</DisplayText>
            <BodyText color={Palette.muted}>Accès simulé · {program.modules.length} modules</BodyText>
          </View>
          <DojoButton style={styles.continueButton}>Continuer</DojoButton>
        </Card>
      ))}

      <Card style={styles.creatorCard}>
        <LabelText color={Palette.oxblood}>Devenir créateur</LabelText>
        <BodyText>
          Publie un programme, gagne un rang, puis laisse l’algorithme mesurer la qualité réelle.
        </BodyText>
        <DojoButton>Ouvrir le studio</DojoButton>
      </Card>
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Card style={styles.stat}>
      {icon}
      <DisplayText style={styles.statValue}>{value}</DisplayText>
      <LabelText>{label}</LabelText>
    </Card>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    backgroundColor: Palette.black,
    borderColor: 'rgba(185,144,74,0.34)',
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  name: {
    fontSize: 42,
    lineHeight: 43,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    minHeight: 116,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
  },
  statValue: {
    fontSize: 34,
    lineHeight: 35,
  },
  goals: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  purchaseCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  programTitle: {
    fontSize: 32,
    lineHeight: 33,
  },
  continueButton: {
    minWidth: 122,
  },
  creatorCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
