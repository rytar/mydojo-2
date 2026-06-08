import type { ImageSourcePropType } from 'react-native';

export type Difficulty = 'debutant' | 'intermediaire' | 'avance';

export type ProgramDomain =
  | 'force'
  | 'perte-de-gras'
  | 'mobilite'
  | 'nutrition'
  | 'mindset'
  | 'discipline';

export type ProgramStatus = 'brouillon' | 'soumis' | 'approuve' | 'corrections' | 'masque';

export type CreatorRank = 'sensei verifie' | 'coach pro' | 'createur emergent' | 'membre';

export type CreatorProfile = {
  id: string;
  name: string;
  rank: CreatorRank;
  avatar: string;
  trustScore: number;
  verified: boolean;
  specialty: string;
};

export type Program = {
  id: string;
  backendId?: string;
  slug?: string;
  title: string;
  category: string;
  domain: ProgramDomain;
  description: string;
  longDescription: string;
  difficulty: Difficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  averageMinutes: number;
  score: number;
  rating: number;
  reviewCount: number;
  students: string;
  priceLabel: string;
  status: ProgramStatus;
  creator: CreatorProfile;
  image: ImageSourcePropType;
  accent: string;
  tags: string[];
  modules: string[];
  algorithmSignals: {
    completion: number;
    reviewQuality: number;
    reports: number;
    creatorBoost: number;
  };
};

export type Review = {
  id: string;
  programId: string;
  author: string;
  rank: string;
  rating: number;
  body: string;
  helpful: number;
  completed: boolean;
};

export type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: string;
  streak: number;
};
