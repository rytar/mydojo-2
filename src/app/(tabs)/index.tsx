import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperTexture } from '@/components/mydojo/layout';
import { ProgramCard } from '@/components/mydojo/program-card';
import { Avatar, Pill, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { MaxContentWidth, Palette, Radius, Spacing } from '@/constants/theme';
import { currentUser } from '@/data/mydojo';
import { listPrograms } from '@/services/programs';
import type { Program } from '@/types/mydojo';

const filters = ['Tous', 'Force', 'Perte de gras', 'Mobilité', 'Nutrition', 'Mindset'];
const exploreHero = require('@/assets/images/mydojo-hero.png');

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState('Tous');
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

  const filteredPrograms = useMemo(() => {
    if (!catalog.length) return [];
    if (activeFilter === 'Tous') return catalog.slice(1);
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const q = norm(activeFilter);
    return catalog.filter((p) =>
      norm(`${p.category} ${p.difficulty} ${p.domain} ${p.tags.join(' ')}`).includes(q),
    );
  }, [activeFilter, catalog]);

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

        <View style={s.inner}>

          {/* Filtres */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillRow} style={s.pillScroll}>
            {filters.map((f) => (
              <Pill key={f} active={activeFilter === f} onPress={() => setActiveFilter(f)}>{f}</Pill>
            ))}
          </ScrollView>

          {/* À la une */}
          {!loading && featured && (
            <>
              <SectionHeader title="À la une" action="" />
              <ProgramCard program={featured} featured />
            </>
          )}

          {/* Recommandés */}
          {!loading && filteredPrograms.length > 0 && (
            <>
              <SectionHeader title="Recommandés" action="Voir tout" />
              <View style={s.compactList}>
                {filteredPrograms.slice(0, 5).map((program, i) => (
                  <ProgramCard key={program.id} program={program} compact rank={i + 1} />
                ))}
              </View>
            </>
          )}

          {/* Domaines */}
          <SectionHeader title="Explorer par domaine" action="" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.domainRow}>
            {[
              { label: 'Force', color: Palette.oxblood },
              { label: 'Mobilité', color: Palette.success },
              { label: 'Nutrition', color: Palette.gold },
              { label: 'Mindset', color: Palette.inkSoft },
              { label: 'Perte de gras', color: Palette.warning },
            ].map(({ label, color }) => (
              <Pressable key={label} style={[s.domainChip, { borderColor: color + '44' }]}>
                <View style={[s.domainDot, { backgroundColor: color }]} />
                <LabelText color={color}>{label}</LabelText>
              </Pressable>
            ))}
          </ScrollView>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.paper },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    zIndex: 10,
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

  scroll: { paddingBottom: 32 },

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

  inner: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.three,
  },

  pillScroll: { marginHorizontal: -Spacing.three },
  pillRow: { flexDirection: 'row', gap: Spacing.two, paddingHorizontal: Spacing.three },

  compactList: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,253,247,0.72)',
  },

  domainRow: { gap: Spacing.two, paddingRight: Spacing.three },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: Radius.round,
    borderWidth: 1,
    backgroundColor: 'rgba(255,253,247,0.6)',
  },
  domainDot: { width: 7, height: 7, borderRadius: 4 },
});

