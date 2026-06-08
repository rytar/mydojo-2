import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperTexture } from '@/components/mydojo/layout';
import { Avatar } from '@/components/mydojo/primitives';
import { ProgramCard } from '@/components/mydojo/program-card';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { currentUser } from '@/data/mydojo';
import { listPrograms } from '@/services/programs';
import type { Program } from '@/types/mydojo';

const exploreHero = require('@/assets/images/mydojo-hero.png');

type ShelfSection = {
  id: string;
  title: string;
  programs: Program[];
  categoryKey: string;
};

function buildSections(catalog: Program[]): ShelfSection[] {
  if (catalog.length === 0) return [];

  const byScore = [...catalog].sort((a, b) => b.score - a.score);
  const byRating = [...catalog].sort((a, b) => b.rating - a.rating);

  const sections: ShelfSection[] = [
    { id: 'top-jour', title: 'Top du jour', programs: byScore.slice(0, 6), categoryKey: 'top-jour' },
    { id: 'top-mois', title: 'Top du mois', programs: byRating.slice(0, 6), categoryKey: 'top-mois' },
    { id: 'pour-toi', title: 'Recommandé pour toi', programs: catalog.slice(0, 6), categoryKey: 'pour-toi' },
  ];

  const domainEntries: { id: Program['domain']; label: string; key: string }[] = [
    { id: 'force', label: 'Force & Performance', key: 'force' },
    { id: 'perte-de-gras', label: 'Perte de gras', key: 'perte-de-gras' },
    { id: 'mobilite', label: 'Mobilité', key: 'mobilite' },
    { id: 'nutrition', label: 'Nutrition', key: 'nutrition' },
    { id: 'mindset', label: 'Mindset', key: 'mindset' },
  ];

  for (const d of domainEntries) {
    const matches = catalog.filter((p) => p.domain === d.id);
    if (matches.length >= 2) {
      sections.push({ id: d.id, title: d.label, programs: matches, categoryKey: d.key });
    }
  }

  return sections;
}

export default function ExploreScreen() {
  const [catalog, setCatalog] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const featured = catalog[0];

  useEffect(() => {
    let cancelled = false;
    listPrograms()
      .then((items) => { if (!cancelled) { setCatalog(items); } })
      .catch(() => {})
      .finally(() => { if (!cancelled) { setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const sections = buildSections(catalog);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <PaperTexture />

      {/* HEADER FIXE */}
      <View style={s.header}>
        <View style={s.brandRow}>
          <Image
            source={require('@/assets/images/brand/mydojo-mark.png')}
            style={s.brandMark}
            contentFit="contain"
          />
          <Image
            source={require('@/assets/images/brand/mydojo-wordmark.png')}
            style={s.brandWordmark}
            contentFit="contain"
          />
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.iconBtn}>
            <Bell size={19} color={Palette.ink} strokeWidth={1.9} />
          </Pressable>
          <Avatar label={currentUser.avatar} size={36} />
        </View>
      </View>

      {/* SCROLL */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(60).duration(440)} style={s.hero}>
          <Image source={exploreHero} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: '72%', top: '50%' }} />
          <LinearGradient colors={['rgba(14,13,11,0.72)', 'rgba(14,13,11,0.18)', 'rgba(14,13,11,0.54)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(14,13,11,0.0)', 'rgba(14,13,11,0.72)']} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />
          <View style={s.heroCopy}>
            <LabelText color={Palette.goldSoft} style={s.eyebrow}>Catalogue</LabelText>
            <DisplayText color={Palette.paperSoft} style={s.heroTitle}>Explorer</DisplayText>
            <BodyText color={Palette.paperSoft} style={s.heroSub}>Protocoles certifiés · Créateurs vérifiés</BodyText>
          </View>
          <View style={s.searchRow}>
            <Search size={18} color={Palette.muted} />
            <TextInput placeholder="Rechercher un protocole..." placeholderTextColor={Palette.faint} style={s.searchInput} />
            <Pressable style={s.filterBtn}><SlidersHorizontal size={17} color={Palette.ink} /></Pressable>
          </View>
        </Animated.View>

        {/* À la une */}
        {!loading && featured && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <LabelText style={s.sectionTitle}>À la une</LabelText>
            </View>
            <View style={s.featuredPad}>
              <ProgramCard program={featured} featured />
            </View>
          </View>
        )}

        {/* Carousels par catégorie */}
        {!loading && sections.map((section) => (
          <View key={section.id} style={s.section}>
            <View style={s.sectionHead}>
              <LabelText style={s.sectionTitle}>{section.title}</LabelText>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/catalog/[category]',
                    params: { category: section.categoryKey },
                  })
                }>
                <LabelText color={Palette.gold} style={s.seeAll}>Voir tout</LabelText>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.shelf}>
              {section.programs.map((program, i) => (
                <ProgramCard key={program.id} program={program} shelf delay={i * 80} />
              ))}
            </ScrollView>
          </View>
        ))}

        <View style={s.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.paper },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    zIndex: 20,
    elevation: 20,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandMark: { width: 22, height: 22 },
  brandWordmark: { width: 100, height: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,247,0.6)',
    borderWidth: 1,
    borderColor: Palette.line,
  },

  scroll: { paddingTop: 52, paddingBottom: 0 },

  hero: {
    minHeight: 240,
    backgroundColor: Palette.black,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  heroCopy: { gap: 5 },
  eyebrow: { fontSize: 10, letterSpacing: 2.2 },
  heroTitle: { fontSize: 38, lineHeight: 38 },
  heroSub: { fontSize: 13, lineHeight: 18, fontWeight: '600', opacity: 0.78 },
  searchRow: {
    marginTop: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Palette.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,253,247,0.9)',
    paddingHorizontal: Spacing.three,
    shadowColor: Palette.black,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  searchInput: { flex: 1, color: Palette.ink, fontSize: 15 },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Palette.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: Palette.ink,
  },
  seeAll: {
    fontSize: 12,
    letterSpacing: 0.2,
  },

  featuredPad: {
    paddingHorizontal: Spacing.three,
  },

  shelf: {
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingBottom: 4,
  },

  bottomPad: { height: 40 },
});

