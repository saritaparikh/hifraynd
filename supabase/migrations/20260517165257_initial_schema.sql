-- ============================================================
-- ENUMS
-- Defined before tables because tables depend on them
-- ============================================================

create type contact_status as enum (
  'potential',
  'active', 
  'nurture',
  'dormant'
);

create type relationship_type as enum (
  'friend',
  'former_colleague',
  'current_colleague',
  'mentor',
  'mentee',
  'recruiter',
  'investor',
  'acquaintance',
  'other'
);

create type relationship_strength as enum (
  'strong',
  'medium',
  'casual'
);

create type interaction_type as enum (
  'email',
  'call',
  'in_person',
  'other'
);

create type delivery_direction as enum (
  'to_them',
  'from_them'
);


-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Defined before tables so triggers can reference it
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ============================================================
-- COMPANIES
-- ============================================================

create table companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  website     text,
  industry    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger update_companies_updated_at
  before update on companies
  for each row execute function update_updated_at();


-- ============================================================
-- PERSONS
-- ============================================================

create table persons (
  id                      uuid primary key default gen_random_uuid(),
  first_name              text not null,
  last_name               text not null,
  email                   text,
  phone                   text,
  linkedin_url            text,
  location                text,
  company_id              uuid references companies(id) on delete set null,
  title                   text,
  how_we_met              text,
  introduced_by           uuid references persons(id) on delete set null,
  relationship_type       relationship_type[],
  relationship_strength   relationship_strength,
  what_i_can_do_for_them  text,
  personal_notes          text,
  professional_notes      text,
  next_reach_out_date     date,
  status                  contact_status not null default 'potential',
  job_search_relevant     boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger update_persons_updated_at
  before update on persons
  for each row execute function update_updated_at();


-- ============================================================
-- INTERACTIONS
-- ============================================================

create table interactions (
  id               uuid primary key default gen_random_uuid(),
  person_id        uuid not null references persons(id) on delete cascade,
  type             interaction_type not null,
  interaction_date date not null,
  notes            text,
  created_at       timestamptz not null default now()
);


-- ============================================================
-- DELIVERIES
-- ============================================================

create table deliveries (
  id             uuid primary key default gen_random_uuid(),
  person_id      uuid not null references persons(id) on delete cascade,
  interaction_id uuid references interactions(id) on delete set null,
  direction      delivery_direction not null,
  description    text not null,
  due_date       date,
  completed      boolean not null default false,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);


-- ============================================================
-- TAGS
-- ============================================================

create table tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);


-- ============================================================
-- PERSON_TAGS (junction table)
-- ============================================================

create table person_tags (
  person_id  uuid not null references persons(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (person_id, tag_id)
);
