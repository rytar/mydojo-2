import { supabase } from '@/lib/supabase';

export type DraftProgramInput = {
  title: string;
  domain: string;
  difficulty: string;
  description: string;
};

export async function submitProgramDraft(input: DraftProgramInput) {
  if (!supabase) {
    return {
      id: `mock-${Date.now()}`,
      status: 'submitted',
    };
  }

  const { data: creator, error: creatorError } = await supabase
    .from('creator_profiles')
    .select('id')
    .eq('status', 'active')
    .maybeSingle();

  if (creatorError) {
    throw creatorError;
  }

  if (!creator) {
    throw new Error('Aucun profil créateur actif trouvé.');
  }

  const { data, error } = await supabase
    .from('programs')
    .insert({
      creator_id: creator.id,
      title: input.title,
      slug: slugify(input.title),
      domain: mapDomain(input.domain),
      category: input.domain,
      description: input.description,
      long_description: input.description,
      difficulty: mapDifficulty(input.difficulty),
      duration_weeks: 8,
      sessions_per_week: 3,
      average_minutes: 45,
      status: 'submitted',
    })
    .select('id, status')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapDomain(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('nutrition')) {
    return 'nutrition';
  }
  if (normalized.includes('mobil')) {
    return 'mobilite';
  }
  if (normalized.includes('mindset')) {
    return 'mindset';
  }
  return 'force';
}

function mapDifficulty(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('inter')) {
    return 'intermediaire';
  }
  if (normalized.includes('avanc')) {
    return 'avance';
  }
  return 'debutant';
}
