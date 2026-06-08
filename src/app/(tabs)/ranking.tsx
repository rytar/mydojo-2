import { Bell, Circle, Crown, Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/mydojo/layout';
import { Avatar, Card, DojoButton, Pill } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { currentUser, leaderboard } from '@/data/mydojo';

export default function RankingScreen() {
  const topThree = [leaderboard[0], leaderboard[1], leaderboard[2]];

  return (
    <Screen>
      <View style={styles.topBar}>
        <Bell color={Palette.ink} size={23} />
        <LabelText color={Palette.ink} style={styles.brand}>
          MYDOJO
        </LabelText>
        <Avatar label={currentUser.avatar} />
      </View>

      <View>
        <DisplayText style={styles.title}>Classement</DisplayText>
        <BodyText color={Palette.muted}>
          Compare ta progression et atteins le sommet.
        </BodyText>
      </View>

      <View style={styles.segment}>
        <Pill active>Hebdo</Pill>
        <Pill>Global</Pill>
      </View>

      <Card style={styles.podium}>
        <LabelText color={Palette.oxblood}>Top 3</LabelText>
        <View style={styles.podiumRow}>
          {topThree.map((user, index) => (
            <View key={user.id} style={[styles.podiumItem, index === 1 && styles.winner]}>
              <View style={[styles.podiumAvatar, index === 1 && styles.winnerAvatar]}>
                <Avatar label={user.avatar} size={index === 1 ? 76 : 58} />
                <View style={styles.medal}>
                  <LabelText color={Palette.ink}>{index === 1 ? 1 : index === 0 ? 2 : 3}</LabelText>
                </View>
              </View>
              <BodyText style={styles.podiumName}>{user.name}</BodyText>
              <BodyText color={Palette.oxblood}>{user.score}</BodyText>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.list}>
        {leaderboard.slice(2).map((user, index) => (
          <View key={user.id} style={styles.row}>
            <BodyText style={styles.rank}>{index + 3}</BodyText>
            <Avatar label={user.avatar} size={34} />
            <View style={{ flex: 1 }}>
              <BodyText style={styles.name}>
                {user.name} {user.id === 'alex' ? '(Vous)' : ''}
              </BodyText>
              <LabelText>
                {user.rank} · {user.streak} jours
              </LabelText>
            </View>
            <BodyText style={styles.score}>{user.score}</BodyText>
          </View>
        ))}
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Circle color={Palette.black} size={34} />
          <DisplayText style={styles.statNumber}>3</DisplayText>
          <LabelText>Série actuelle</LabelText>
        </Card>
        <Card style={styles.statCard}>
          <Crown color={Palette.gold} size={34} />
          <DisplayText style={styles.statNumber}>{currentUser.dojoScore}</DisplayText>
          <LabelText>Dojo score</LabelText>
        </Card>
      </View>

      <Card style={styles.pointsCard}>
        <Trophy color={Palette.oxblood} size={38} />
        <View style={{ flex: 1 }}>
          <LabelText color={Palette.oxblood}>Gagner des points</LabelText>
          <BodyText>
            Entraîne-toi régulièrement, termine les programmes et laisse des avis utiles.
          </BodyText>
        </View>
        <DojoButton style={styles.smallButton}>Voir</DojoButton>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 16,
    letterSpacing: 2.5,
  },
  title: {
    fontSize: 54,
    lineHeight: 55,
  },
  segment: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  podium: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  podiumItem: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  winner: {
    transform: [{ translateY: -10 }],
  },
  podiumAvatar: {
    position: 'relative',
  },
  winnerAvatar: {
    padding: Spacing.one,
    borderRadius: Radius.round,
    borderWidth: 2,
    borderColor: Palette.gold,
  },
  medal: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumName: {
    fontWeight: '900',
  },
  list: {
    paddingHorizontal: Spacing.three,
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  rank: {
    width: 22,
    textAlign: 'center',
  },
  name: {
    fontWeight: '900',
  },
  score: {
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    minHeight: 124,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  statNumber: {
    fontSize: 42,
    lineHeight: 43,
  },
  pointsCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  smallButton: {
    minWidth: 86,
  },
});
