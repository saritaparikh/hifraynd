-- ============================================================
-- ADD USER_ID TO ALL OWNER TABLES
-- References auth.users which is Supabase's built-in auth table
-- ============================================================

alter table companies
  add column user_id uuid not null references auth.users(id) on delete cascade;

alter table persons
  add column user_id uuid not null references auth.users(id) on delete cascade;

alter table interactions
  add column user_id uuid not null references auth.users(id) on delete cascade;

alter table deliveries
  add column user_id uuid not null references auth.users(id) on delete cascade;

alter table tags
  add column user_id uuid not null references auth.users(id) on delete cascade;


-- ============================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- RLS is disabled by default in PostgreSQL
-- ============================================================

alter table companies    enable row level security;
alter table persons      enable row level security;
alter table interactions enable row level security;
alter table deliveries   enable row level security;
alter table tags         enable row level security;
alter table person_tags  enable row level security;


-- ============================================================
-- RLS POLICIES
-- auth.uid() is a Supabase function that returns the ID of
-- the currently authenticated user making the request
-- ============================================================

-- COMPANIES
create policy "users can select own companies"
  on companies for select
  using (user_id = auth.uid());

create policy "users can insert own companies"
  on companies for insert
  with check (user_id = auth.uid());

create policy "users can update own companies"
  on companies for update
  using (user_id = auth.uid());

create policy "users can delete own companies"
  on companies for delete
  using (user_id = auth.uid());


-- PERSONS
create policy "users can select own persons"
  on persons for select
  using (user_id = auth.uid());

create policy "users can insert own persons"
  on persons for insert
  with check (user_id = auth.uid());

create policy "users can update own persons"
  on persons for update
  using (user_id = auth.uid());

create policy "users can delete own persons"
  on persons for delete
  using (user_id = auth.uid());


-- INTERACTIONS
create policy "users can select own interactions"
  on interactions for select
  using (user_id = auth.uid());

create policy "users can insert own interactions"
  on interactions for insert
  with check (user_id = auth.uid());

create policy "users can update own interactions"
  on interactions for update
  using (user_id = auth.uid());

create policy "users can delete own interactions"
  on interactions for delete
  using (user_id = auth.uid());


-- DELIVERIES
create policy "users can select own deliveries"
  on deliveries for select
  using (user_id = auth.uid());

create policy "users can insert own deliveries"
  on deliveries for insert
  with check (user_id = auth.uid());

create policy "users can update own deliveries"
  on deliveries for update
  using (user_id = auth.uid());

create policy "users can delete own deliveries"
  on deliveries for delete
  using (user_id = auth.uid());


-- TAGS
create policy "users can select own tags"
  on tags for select
  using (user_id = auth.uid());

create policy "users can insert own tags"
  on tags for insert
  with check (user_id = auth.uid());

create policy "users can update own tags"
  on tags for update
  using (user_id = auth.uid());

create policy "users can delete own tags"
  on tags for delete
  using (user_id = auth.uid());


-- PERSON_TAGS
-- Junction table: access is controlled by checking if the user
-- owns the person being tagged. No direct user_id column needed
-- because person_tags has no independent existence outside a person.

create policy "users can select own person_tags"
  on person_tags for select
  using (
    exists (
      select 1 from persons
      where persons.id = person_tags.person_id
      and persons.user_id = auth.uid()
    )
  );

create policy "users can insert own person_tags"
  on person_tags for insert
  with check (
    exists (
      select 1 from persons
      where persons.id = person_tags.person_id
      and persons.user_id = auth.uid()
    )
  );

create policy "users can delete own person_tags"
  on person_tags for delete
  using (
    exists (
      select 1 from persons
      where persons.id = person_tags.person_id
      and persons.user_id = auth.uid()
    )
  );
