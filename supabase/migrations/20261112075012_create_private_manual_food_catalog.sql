create table public.gather_manual_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  name_key text not null,
  portion_quantity numeric not null default 1 check (portion_quantity > 0),
  portion_unit text not null default 'serving',
  kcal numeric not null check (kcal >= 0),
  protein_g numeric check (protein_g is null or protein_g >= 0),
  carbs_g numeric check (carbs_g is null or carbs_g >= 0),
  fat_g numeric check (fat_g is null or fat_g >= 0),
  fibre_g numeric check (fibre_g is null or fibre_g >= 0),
  sugar_g numeric check (sugar_g is null or sugar_g >= 0),
  sodium_mg numeric check (sodium_mg is null or sodium_mg >= 0),
  notes text not null default '',
  source text not null default 'Manual entry',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gather_manual_foods_user_name_key unique (user_id, name_key)
);
alter table public.gather_manual_foods enable row level security;
grant select, insert, update, delete on public.gather_manual_foods to authenticated;
create policy "Users can view their own manual foods"
  on public.gather_manual_foods for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can insert their own manual foods"
  on public.gather_manual_foods for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update their own manual foods"
  on public.gather_manual_foods for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete their own manual foods"
  on public.gather_manual_foods for delete to authenticated
  using ((select auth.uid()) = user_id);
create index gather_manual_foods_user_updated_idx
  on public.gather_manual_foods (user_id, updated_at desc);
