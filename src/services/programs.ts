import { Palette } from '@/constants/theme';
import { programs as mockPrograms } from '@/data/mydojo';
import { supabase } from '@/lib/supabase';
import type { CreatorProfile, Difficulty, Program, ProgramDomain, ProgramStatus } from '@/types/mydojo';

type ProgramRow = {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  domain: string;
  category: string;
  description: string;
  long_description: string | null;
  difficulty: string;
  duration_weeks: number;
  sessions_per_week: number;
  average_minutes: number;
  price_cents: number;
  currency: string;
  cover_image_url: string | null;
  status: string;
  score: number;
  rating_average: number;
  review_count: number;
  student_count: number;
  creator?: CreatorRow | CreatorRow[] | null;
  program_modules?: { title: string; position: number }[];
};

type CreatorRow = {
  id: string;
  display_name: string;
  rank: string;
  verified: boolean;
  trust_score: number;
  specialty: string | null;
};

export async function listPrograms(): Promise<Program[]> {
  if (!supabase) {
    return mockPrograms;
  }

  const { data, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      creator_id,
      title,
      slug,
      domain,
      category,
      description,
      long_description,
      difficulty,
      duration_weeks,
      sessions_per_week,
      average_minutes,
      price_cents,
      currency,
      cover_image_url,
      status,
      score,
      rating_average,
      review_count,
      student_count,
      creator:creator_profiles (
        id,
        display_name,
        rank,
        verified,
        trust_score,
        specialty
      ),
      program_modules (
        title,
        position
      )
    `,
    )
    .eq('status', 'approved')
    .order('score', { ascending: false })
    .limit(30);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapProgram);
}

export async function getProgram(routeId: string): Promise<Program | null> {
  if (!supabase) {
    return mockPrograms.find((program) => program.id === routeId || program.slug === routeId) ?? null;
  }

  const { data, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      creator_id,
      title,
      slug,
      domain,
      category,
      description,
      long_description,
      difficulty,
      duration_weeks,
      sessions_per_week,
      average_minutes,
      price_cents,
      currency,
      cover_image_url,
      status,
      score,
      rating_average,
      review_count,
      student_count,
      creator:creator_profiles (
        id,
        display_name,
        rank,
        verified,
        trust_score,
        specialty
      ),
      program_modules (
        title,
        position
      )
    `,
    )
    .eq('slug', routeId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProgram(data) : null;
}

function mapProgram(row: ProgramRow): Program {
  const creator = mapCreator(firstRelated(row.creator), row.creator_id);
  const price = row.price_cents > 0 ? `${Math.round(row.price_cents / 100)} ${currencySymbol(row.currency)}` : 'Gratuit';
  const modules = [...(row.program_modules ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((module) => module.title);

  return {
    id: row.slug || row.id,
    backendId: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    domain: mapDomain(row.domain),
    description: row.description,
    longDescription: row.long_description ?? row.description,
    difficulty: mapDifficulty(row.difficulty),
    durationWeeks: row.duration_weeks,
    sessionsPerWeek: row.sessions_per_week,
    averageMinutes: row.average_minutes,
    score: row.score,
    rating: Number(row.rating_average ?? 0),
    reviewCount: row.review_count,
    students: compactCount(row.student_count),
    priceLabel: price,
    status: mapStatus(row.status),
    creator,
    image: row.cover_image_url
      ? { uri: row.cover_image_url }
      : require('@/assets/images/mydojo-hero.png'),
    accent: creator.verified ? Palette.gold : Palette.oxblood,
    tags: [row.category, labelForDifficulty(row.difficulty), creator.specialty].filter(Boolean),
    modules: modules.length ? modules : ['Fondations', 'Progression', 'Suivi'],
    algorithmSignals: {
      completion: Math.min(100, 50 + Math.round(row.student_count / 10)),
      reviewQuality: Math.round(Number(row.rating_average ?? 0) * 20),
      reports: 0,
      creatorBoost: creator.verified ? 10 : 4,
    },
  };
}

function mapCreator(row: CreatorRow | null | undefined, fallbackId: string): CreatorProfile {
  return {
    id: row?.id ?? fallbackId,
    name: row?.display_name ?? 'Créateur MYDOJO',
    rank: mapCreatorRank(row?.rank),
    avatar: initials(row?.display_name ?? 'MYDOJO'),
    trustScore: row?.trust_score ?? 50,
    verified: row?.verified ?? false,
    specialty: row?.specialty ?? 'Programme structuré',
  };
}

function firstRelated<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function mapCreatorRank(rank?: string): CreatorProfile['rank'] {
  if (rank === 'sensei_verifie') {
    return 'sensei verifie';
  }
  if (rank === 'coach_pro') {
    return 'coach pro';
  }
  if (rank === 'createur_emergent') {
    return 'createur emergent';
  }
  return 'membre';
}

function mapDomain(domain: string): ProgramDomain {
  if (domain === 'perte_de_gras') {
    return 'perte-de-gras';
  }
  if (domain === 'mobilite' || domain === 'nutrition' || domain === 'mindset' || domain === 'discipline') {
    return domain;
  }
  return 'force';
}

function mapDifficulty(value: string): Difficulty {
  if (value === 'intermediaire') {
    return 'intermediaire';
  }
  if (value === 'avance') {
    return 'avance';
  }
  return 'debutant';
}

function mapStatus(value: string): ProgramStatus {
  if (value === 'submitted') {
    return 'soumis';
  }
  if (value === 'needs_changes') {
    return 'corrections';
  }
  if (value === 'hidden') {
    return 'masque';
  }
  if (value === 'draft') {
    return 'brouillon';
  }
  return 'approuve';
}

function labelForDifficulty(value: string) {
  if (value === 'intermediaire') {
    return 'Intermédiaire';
  }
  if (value === 'avance') {
    return 'Avancé';
  }
  return 'Débutant';
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function compactCount(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }
  return `${value}`;
}

function currencySymbol(currency: string) {
  if (currency.toUpperCase() === 'EUR') {
    return '€';
  }
  return currency.toUpperCase();
}
