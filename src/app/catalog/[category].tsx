import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperTexture } from '@/components/mydojo/layout';
import { ProgramCard } from '@/components/mydojo/program-card';
import { LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { listPrograms } from '@/services/programs';
import type { Program } from '@/types/mydojo';

const SECTION_TITLES: Record<string, string> = {
  'top-jour': 'Top du jour',
  'top-mois': 'Top du mois',
  'pour-toi': 'Recommandé pour toi',
  force: 'Force & Performance',
  'perte-de-gras': 'Perte de gras',
  mobilite: 'Mobilité',
  nutrition: 'Nutrition',
  mindset: 'Mindset',
};

export default function CatalogScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const title = SECTION_TITLES[category] ?? category;

  useEffect(() => {
    let cancelled = false;
    listPrograms()
      .then((items) => {
        if (cancelled) return;
        if (category === 'top-jour') {
          setPrograms([...items].sort((a, b) => b.score - a.score));
        } else if (category === 'top-mois') {
          setPrograms([...items].sort((a, b) => b.rating - a.rating));
        } else if (category === 'pour-toi') {
          setPrograms(items);
        } else {
          setPrograms(items.filter((p) => p.domain === category));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category]);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <PaperTexture />

      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={Palette.ink} strokeWidth={1.9} />
        </Pressable>
        <LabelText style={s.headerTitle}>{title}</LabelText>
        <View style={s.headerSpacer} />
      </View>

      {/* List */}
      {!loading && (
        <FlatList
          data={programs}
          keyExtractor={(p) => p.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={s.separator} />}
          renderItem={({ item }) => <ProgramCard program={item} />}
        />
      )}
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
    paddingHorizontal: Spacing.two,
    backgroundColor: Palette.paper,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,247,0.6)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: Palette.ink,
  },
  headerSpacer: { width: 36 },

  list: {
    padding: Spacing.three,
    paddingBottom: 40,
  },
  separator: { height: Spacing.three },
});
