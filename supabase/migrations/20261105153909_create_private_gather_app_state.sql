-- Retained as a private rollback/backup snapshot while active Gather data uses
-- normalized, owner-scoped tables.
create table if not exists public.gather_app_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  state_key text not null check (state_key = any (array['recipes','saved-meals','daily-plans','pantry','calorie-goals','current-meal']::text[])),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id,state_key)
);
alter table public.gather_app_state enable row level security;
drop policy if exists "Users can read their Gather state" on public.gather_app_state;
create policy "Users can read their Gather state" on public.gather_app_state for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "Users can insert their Gather state" on public.gather_app_state;
create policy "Users can insert their Gather state" on public.gather_app_state for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "Users can update their Gather state" on public.gather_app_state;
create policy "Users can update their Gather state" on public.gather_app_state for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "Users can delete their Gather state" on public.gather_app_state;
create policy "Users can delete their Gather state" on public.gather_app_state for delete to authenticated using ((select auth.uid())=user_id);
grant select,insert,update,delete on public.gather_app_state to authenticated;
revoke all on public.gather_app_state from anon;
