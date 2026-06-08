import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, Search, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Screen } from '@/components/mydojo/layout';
import { ProgramCard } from '@/components/mydojo/program-card';
import { Avatar, Card, Pill, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { currentUser } from '@/data/mydojo';
import { listPrograms } from '@/services/programs';
import type { Program } from '@/types/mydojo';

const filters = ['Tous', 'Débutant', 'Force', 'Perte de gras', 'Mobilité', 'Nutrition'];
const exploreHero = require('@/assets/images/mydojo-hero.png');

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [catalog, setCatalog] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const featured = catalog[0];

  useEffect(() => {
    let cancelled = false;

    listPrograms()
      .then((items) => {
        if (!cancelled) {
          setCatalog(items);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Impossible de charger le catalogue.');
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
  }, []);

  const filteredPrograms = useMemo(() => {
    if (!catalog.length) {
      return [];
    }

    if (activeFilter === 'Tous') {
      return catalog.slice(1);
    }

    const normalizedFilter = normalize(activeFilter);
    return catalog
      .filter((program) => {
        const haystack = normalize(`${program.category} ${program.difficulty} ${program.tags.join(' ')}`);
        return haystack.includes(normalizedFilter);
      })
      .concat(catalog.slice(1, 4))
      .filter((program, index, list) => list.findIndex((item) => item.id === program.id) === index);
  }, [activeFilter, catalog]);

  return (
    <Screen contentStyle={styles.screenContent} edges={['left', 'right']}>
      <Animated.View entering={FadeInDown.delay(70).duration(460)} style={styles.hero}>
        <Image
          source={exploreHero}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition={{ left: '74%', top: '50%' }}
        />
        <LinearGradient
          colors={['rgba(14,13,11,0.28)', 'rgba(14,13,11,0.32)', 'rgba(14,13,11,0.86)']}
          locations={[0, 0.48, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(14,13,11,0.74)', 'rgba(14,13,11,0.08)']}
          start={{ x: 0, y: 0.48 }}
          end={{ x: 0.72, y: 0.48 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.floatingHeader}>
          <Pressable style={({ pressed }) => [styles.headerIcon, pressed && styles.pressed]}>
            <Menu color={Palette.paperSoft} size={20} strokeWidth={1.9} />
          </Pressable>
          <View style={styles.brandCapsule}>
            <Image
              source={require('@/assets/images/brand/mydojo-mark.png')}
              style={styles.brandMark}
              contentFit="contain"
            />
            <Image
              source={require('@/assets/images/brand/mydojo-wordmark.png')}
              style={styles.brandWordmark}
              contentFit="contain"
            />
          </View>
          <View style={styles.avatarHalo}>
            <Avatar label={currentUser.avatar} size={35} />
          </View>
        </View>

        <View style={styles.heroCopy}>
          <DisplayText color={Palette.paperSoft} style={styles.heroTitle}>
            Explorer
          </DisplayText>
          <View style={styles.heroUnderline} />
          <BodyText color={Palette.paperSoft} style={styles.heroSubtitle}>
            Trouve ton prochain protocole.
          </BodyText>
        </View>

        <View style={styles.searchBox}>
          <Search size={22} color={Palette.muted} />
          <TextInput
            placeholder="Rechercher un protocole..."
            placeholderTextColor={Palette.faint}
            style={styles.input}
          />
          <SlidersHorizontal size={20} color={Palette.ink} />
        </View>
      </Animated.View>

      {loading && (
        <Card style={styles.statusCard}>
          <BodyText>Chargement du catalogue MYDOJO...</BodyText>
        </Card>
      )}

      {loadError && (
        <Card style={styles.statusCard}>
          <LabelText color={Palette.oxblood}>Catalogue</LabelText>
          <BodyText>{loadError}</BodyText>
        </Card>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filterScroll}>
        {filters.map((filter) => (
          <Pill key={filter} active={activeFilter === filter} onPress={() => setActiveFilter(filter)}>
            {filter}
          </Pill>
        ))}
      </ScrollView>

      <SectionHeader title="À la une" />
      {featured && <ProgramCard program={featured} featured />}

      <SectionHeader title="Recommandés pour toi" />
      <View style={styles.list}>
        {filteredPrograms.slice(0, 4).map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </View>

      <SectionHeader title="Nouveaux domaines" action="Explorer" />
      <View style={styles.domainGrid}>
        {['Force', 'Nutrition', 'Mobilité', 'Mindset'].map((domain, index) => (
          <View key={domain} style={styles.domainCard}>
            <LabelText color={index % 2 ? Palette.gold : Palette.oxblood}>{domain}</LabelText>
            <BodyText style={styles.domainBody}>
              Score, avis et créateurs classés avant la mise en avant.
            </BodyText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.74,
  },
  screenContent: {
    paddingTop: 0,
  },
  hero: {
    minHeight: 292,
    marginHorizontal: -Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: Palette.black,
  },
  floatingHeader: {
    position: 'absolute',
    top: 16,
    left: Spacing.three,
    right: Spacing.three,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,13,11,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.28)',
  },
  brandCapsule: {
    minHeight: 40,
    borderRadius: Radius.round,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,253,247,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.68)',
    shadowColor: Palette.black,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
  },
  brandMark: {
    width: 23,
    height: 23,
  },
  brandWordmark: {
    width: 104,
    height: 15,
  },
  avatarHalo: {
    width: 42,
    height: 42,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,247,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.24)',
  },
  heroCopy: {
    maxWidth: 292,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 38,
  },
  heroUnderline: {
    width: 44,
    height: 2,
    backgroundColor: Palette.oxblood,
    marginTop: 6,
    marginBottom: 9,
  },
  heroSubtitle: {
    maxWidth: 238,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  searchBox: {
    minHeight: 56,
    marginTop: 0,
    zIndex: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.9)',
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    shadowColor: Palette.black,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  },
  input: {
    flex: 1,
    color: Palette.ink,
    fontSize: 16,
    minWidth: 0,
  },
  filterScroll: {
    marginHorizontal: -Spacing.three,
    marginTop: 0,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  domainCard: {
    width: '48%',
    minHeight: 116,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,253,247,0.5)',
  },
  domainBody: {
    marginTop: Spacing.two,
    fontSize: 13,
    lineHeight: 18,
  },
  statusCard: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
