import { reviews as mockReviews } from '@/data/mydojo';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/types/mydojo';

type ReviewRow = {
  id: string;
  program_id: string;
  rating: number;
  body: string;
  completed_program: boolean;
  helpful_count: number;
  profile?:
    | {
        display_name: string;
        level: string;
      }
    | {
      display_name: string;
      level: string;
    }[]
    | null;
};

export async function listProgramReviews(programId: string): Promise<Review[]> {
  if (!supabase) {
    return mockReviews.filter((review) => review.programId === programId);
  }

  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      id,
      program_id,
      rating,
      body,
      completed_program,
      helpful_count,
      profile:profiles (
        display_name,
        level
      )
    `,
    )
    .eq('program_id', programId)
    .eq('status', 'published')
    .order('helpful_count', { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapReview);
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    programId: row.program_id,
    author: firstRelated(row.profile)?.display_name ?? 'Membre MYDOJO',
    rank: firstRelated(row.profile)?.level ?? 'membre',
    rating: row.rating,
    body: row.body,
    helpful: row.helpful_count,
    completed: row.completed_program,
  };
}

function firstRelated<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
