-- MYDOJO Supabase schema V1
-- Designed for Postgres + Supabase Auth + Row Level Security.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_level as enum ('debutant', 'intermediaire', 'avance');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.creator_rank as enum ('membre', 'createur_emergent', 'coach_pro', 'sensei_verifie');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.creator_status as enum ('pending', 'active', 'suspended', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.program_domain as enum ('force', 'perte_de_gras', 'mobilite', 'nutrition', 'mindset', 'discipline');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.program_status as enum ('draft', 'submitted', 'needs_changes', 'approved', 'hidden', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.entitlement_source as enum ('simulated', 'manual_grant', 'iap_verified');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.entitlement_status as enum ('active', 'refunded', 'revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.review_status as enum ('published', 'hidden', 'flagged');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  level public.user_level default 'debutant' not null,
  goals text[] default '{}' not null,
  favorite_domains public.program_domain[] default '{}' not null,
  dojo_score integer default 0 not null check (dojo_score >= 0),
  streak_days integer default 0 not null check (streak_days >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  bio text default '' not null,
  specialty text default '' not null,
  rank public.creator_rank default 'createur_emergent' not null,
  verified boolean default false not null,
  trust_score integer default 50 not null check (trust_score between 0 and 100),
  status public.creator_status default 'pending' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(id) on delete restrict,
  title text not null check (char_length(title) between 3 and 90),
  slug text not null unique,
  domain public.program_domain not null,
  category text not null,
  description text not null check (char_length(description) between 20 and 180),
  long_description text default '' not null,
  difficulty public.user_level not null,
  duration_weeks integer not null check (duration_weeks between 1 and 104),
  sessions_per_week integer not null check (sessions_per_week between 1 and 14),
  average_minutes integer not null check (average_minutes between 5 and 240),
  price_cents integer default 0 not null check (price_cents >= 0),
  currency char(3) default 'EUR' not null,
  cover_image_url text,
  status public.program_status default 'draft' not null,
  score integer default 50 not null check (score between 0 and 100),
  rating_average numeric(2,1) default 0 not null check (rating_average between 0 and 5),
  review_count integer default 0 not null check (review_count >= 0),
  student_count integer default 0 not null check (student_count >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  published_at timestamptz
);

create table if not exists public.program_modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  description text default '' not null,
  unique (program_id, position)
);

create table if not exists public.program_sessions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.program_modules(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  duration_minutes integer check (duration_minutes between 1 and 240),
  instructions text default '' not null,
  unique (module_id, position)
);

create table if not exists public.program_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.program_sessions(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  sets integer check (sets between 1 and 20),
  reps text,
  target_load text,
  rest_seconds integer check (rest_seconds between 0 and 900),
  notes text default '' not null,
  unique (session_id, position)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  source public.entitlement_source default 'simulated' not null,
  status public.entitlement_status default 'active' not null,
  created_at timestamptz default now() not null,
  unique (profile_id, program_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 20 and 2000),
  completed_program boolean default false not null,
  helpful_count integer default 0 not null check (helpful_count >= 0),
  status public.review_status default 'published' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (program_id, profile_id)
);

create table if not exists public.review_votes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  vote integer not null check (vote in (-1, 1)),
  created_at timestamptz default now() not null,
  unique (review_id, profile_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('program', 'review', 'creator')),
  target_id uuid not null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text default '' not null,
  status public.report_status default 'open' not null,
  created_at timestamptz default now() not null
);

create table if not exists public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('program', 'review', 'creator', 'report')),
  target_id uuid not null,
  moderator_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  reason text default '' not null,
  created_at timestamptz default now() not null
);

create table if not exists public.ranking_snapshots (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  fit_score integer default 50 not null check (fit_score between 0 and 100),
  review_quality_score integer default 50 not null check (review_quality_score between 0 and 100),
  completion_score integer default 50 not null check (completion_score between 0 and 100),
  creator_score integer default 50 not null check (creator_score between 0 and 100),
  freshness_score integer default 50 not null check (freshness_score between 0 and 100),
  engagement_score integer default 50 not null check (engagement_score between 0 and 100),
  content_completeness_score integer default 50 not null check (content_completeness_score between 0 and 100),
  penalty_score integer default 0 not null check (penalty_score between 0 and 100),
  computed_at timestamptz default now() not null
);

create index if not exists programs_status_score_idx on public.programs (status, score desc, published_at desc);
create index if not exists programs_domain_difficulty_idx on public.programs (domain, difficulty);
create index if not exists creator_profiles_status_rank_idx on public.creator_profiles (status, rank, verified);
create index if not exists reviews_program_status_idx on public.reviews (program_id, status, created_at desc);
create index if not exists entitlements_profile_status_idx on public.entitlements (profile_id, status);
create index if not exists reports_status_idx on public.reports (status, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists creator_profiles_set_updated_at on public.creator_profiles;
create trigger creator_profiles_set_updated_at
before update on public.creator_profiles
for each row execute function public.set_updated_at();

drop trigger if exists programs_set_updated_at on public.programs;
create trigger programs_set_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create or replace function public.compute_program_score(target_program_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  result_score integer;
begin
  select least(100, greatest(0, round(
    0.20 * coalesce(avg(case when r.status = 'published' then r.rating * 20 end), 50)
    + 0.15 * least(100, coalesce(p.student_count, 0))
    + 0.15 * coalesce(cp.trust_score, 50)
    + 0.10 * case when p.published_at > now() - interval '30 days' then 80 else 55 end
    + 0.10 * least(100, coalesce(p.review_count, 0) * 4)
    + 0.05 * case when p.cover_image_url is not null and p.long_description <> '' then 90 else 50 end
    + 0.25 * 70
    - least(80, coalesce(open_reports.count_open, 0) * 12)
  )::integer)) into result_score
  from public.programs p
  join public.creator_profiles cp on cp.id = p.creator_id
  left join public.reviews r on r.program_id = p.id
  left join (
    select target_id, count(*) count_open
    from public.reports
    where target_type = 'program' and status in ('open', 'reviewing')
    group by target_id
  ) open_reports on open_reports.target_id = p.id
  where p.id = target_program_id
  group by p.id, cp.trust_score, open_reports.count_open;

  result_score := coalesce(result_score, 50);

  update public.programs
  set score = result_score
  where id = target_program_id;

  insert into public.ranking_snapshots (
    program_id,
    score,
    review_quality_score,
    creator_score,
    penalty_score
  )
  select
    p.id,
    result_score,
    least(100, greatest(0, round(coalesce(avg(r.rating * 20), 50))::integer)),
    cp.trust_score,
    least(80, coalesce(open_reports.count_open, 0) * 12)
  from public.programs p
  join public.creator_profiles cp on cp.id = p.creator_id
  left join public.reviews r on r.program_id = p.id and r.status = 'published'
  left join (
    select target_id, count(*) count_open
    from public.reports
    where target_type = 'program' and status in ('open', 'reviewing')
    group by target_id
  ) open_reports on open_reports.target_id = p.id
  where p.id = target_program_id
  group by p.id, cp.trust_score, open_reports.count_open;

  return result_score;
end;
$$;

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.programs enable row level security;
alter table public.program_modules enable row level security;
alter table public.program_sessions enable row level security;
alter table public.program_exercises enable row level security;
alter table public.entitlements enable row level security;
alter table public.reviews enable row level security;
alter table public.review_votes enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_events enable row level security;
alter table public.ranking_snapshots enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select using (auth.uid() = auth_user_id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert with check (auth.uid() = auth_user_id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (auth.uid() = auth_user_id) with check (auth.uid() = auth_user_id);

drop policy if exists creator_profiles_select_visible on public.creator_profiles;
create policy creator_profiles_select_visible on public.creator_profiles
for select using (
  status = 'active'
  or exists (
    select 1 from public.profiles p
    where p.id = creator_profiles.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists creator_profiles_insert_own on public.creator_profiles;
create policy creator_profiles_insert_own on public.creator_profiles
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = creator_profiles.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists creator_profiles_update_own on public.creator_profiles;
create policy creator_profiles_update_own on public.creator_profiles
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = creator_profiles.profile_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = creator_profiles.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists programs_select_public_or_own on public.programs;
create policy programs_select_public_or_own on public.programs
for select using (
  status = 'approved'
  or exists (
    select 1
    from public.creator_profiles cp
    join public.profiles p on p.id = cp.profile_id
    where cp.id = programs.creator_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists programs_insert_own_creator on public.programs;
create policy programs_insert_own_creator on public.programs
for insert with check (
  exists (
    select 1
    from public.creator_profiles cp
    join public.profiles p on p.id = cp.profile_id
    where cp.id = programs.creator_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists programs_update_own_creator on public.programs;
create policy programs_update_own_creator on public.programs
for update using (
  exists (
    select 1
    from public.creator_profiles cp
    join public.profiles p on p.id = cp.profile_id
    where cp.id = programs.creator_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.creator_profiles cp
    join public.profiles p on p.id = cp.profile_id
    where cp.id = programs.creator_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists program_modules_select_allowed on public.program_modules;
create policy program_modules_select_allowed on public.program_modules
for select using (
  exists (
    select 1 from public.programs pr
    where pr.id = program_modules.program_id
    and (
      pr.status = 'approved'
      or exists (
        select 1
        from public.creator_profiles cp
        join public.profiles p on p.id = cp.profile_id
        where cp.id = pr.creator_id and p.auth_user_id = auth.uid()
      )
    )
  )
);

drop policy if exists program_modules_write_own_program on public.program_modules;
create policy program_modules_write_own_program on public.program_modules
for all using (
  exists (
    select 1
    from public.programs pr
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where pr.id = program_modules.program_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.programs pr
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where pr.id = program_modules.program_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists program_sessions_select_allowed on public.program_sessions;
create policy program_sessions_select_allowed on public.program_sessions
for select using (
  exists (
    select 1
    from public.program_modules pm
    join public.programs pr on pr.id = pm.program_id
    where pm.id = program_sessions.module_id
    and (
      pr.status = 'approved'
      or exists (
        select 1
        from public.creator_profiles cp
        join public.profiles p on p.id = cp.profile_id
        where cp.id = pr.creator_id and p.auth_user_id = auth.uid()
      )
    )
  )
);

drop policy if exists program_sessions_write_own_program on public.program_sessions;
create policy program_sessions_write_own_program on public.program_sessions
for all using (
  exists (
    select 1
    from public.program_modules pm
    join public.programs pr on pr.id = pm.program_id
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where pm.id = program_sessions.module_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.program_modules pm
    join public.programs pr on pr.id = pm.program_id
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where pm.id = program_sessions.module_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists program_exercises_select_allowed on public.program_exercises;
create policy program_exercises_select_allowed on public.program_exercises
for select using (
  exists (
    select 1
    from public.program_sessions ps
    join public.program_modules pm on pm.id = ps.module_id
    join public.programs pr on pr.id = pm.program_id
    where ps.id = program_exercises.session_id
    and (
      pr.status = 'approved'
      or exists (
        select 1
        from public.creator_profiles cp
        join public.profiles p on p.id = cp.profile_id
        where cp.id = pr.creator_id and p.auth_user_id = auth.uid()
      )
    )
  )
);

drop policy if exists program_exercises_write_own_program on public.program_exercises;
create policy program_exercises_write_own_program on public.program_exercises
for all using (
  exists (
    select 1
    from public.program_sessions ps
    join public.program_modules pm on pm.id = ps.module_id
    join public.programs pr on pr.id = pm.program_id
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where ps.id = program_exercises.session_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.program_sessions ps
    join public.program_modules pm on pm.id = ps.module_id
    join public.programs pr on pr.id = pm.program_id
    join public.creator_profiles cp on cp.id = pr.creator_id
    join public.profiles p on p.id = cp.profile_id
    where ps.id = program_exercises.session_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own on public.entitlements
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = entitlements.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists reviews_select_published on public.reviews;
create policy reviews_select_published on public.reviews
for select using (status = 'published');

drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = reviews.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = reviews.profile_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = reviews.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists review_votes_write_own on public.review_votes;
create policy review_votes_write_own on public.review_votes
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = review_votes.profile_id and p.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = review_votes.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = reports.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists reports_select_own on public.reports;
create policy reports_select_own on public.reports
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = reports.profile_id and p.auth_user_id = auth.uid()
  )
);

drop policy if exists ranking_snapshots_select_public_programs on public.ranking_snapshots;
create policy ranking_snapshots_select_public_programs on public.ranking_snapshots
for select using (
  exists (
    select 1 from public.programs p
    where p.id = ranking_snapshots.program_id and p.status = 'approved'
  )
);

