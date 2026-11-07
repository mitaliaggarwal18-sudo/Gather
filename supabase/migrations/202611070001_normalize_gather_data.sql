-- Move durable Gather data out of app-state JSON blobs into owner-scoped tables.
-- The legacy table is intentionally retained as a read-only rollback snapshot.
create table if not exists public.gather_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  name text not null,
  category text not null default 'Mains',
  servings numeric not null default 1,
  prep_minutes numeric,
  portion_mode text,
  cooked_yield_grams numeric,
  cover_image text,
  cover_offset_x numeric,
  cover_offset_y numeric,
  cover_zoom numeric,
  video_url text,
  notes text,
  legacy_rolls boolean not null default false,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);
create table if not exists public.gather_recipe_ingredients (
  user_id uuid not null,
  recipe_id text not null,
  position integer not null,
  name text not null default '',
  quantity numeric not null default 0,
  unit text not null default 'g',
  kcal numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fibre_g numeric not null default 0,
  photo text,
  nutrition_source text,
  verified boolean not null default false,
  catalog_id text,
  kcal_per_unit numeric,
  protein_per_unit numeric,
  carbs_per_unit numeric,
  fibre_per_unit numeric,
  extra jsonb not null default '{}'::jsonb,
  primary key (user_id, recipe_id, position),
  foreign key (user_id, recipe_id) references public.gather_recipes(user_id, recipe_id) on delete cascade
);
create table if not exists public.gather_recipe_steps (
  user_id uuid not null,
  recipe_id text not null,
  position integer not null,
  instruction text not null,
  image text,
  primary key (user_id, recipe_id, position),
  foreign key (user_id, recipe_id) references public.gather_recipes(user_id, recipe_id) on delete cascade
);
create table if not exists public.gather_ingredient_catalog (
  id text primary key,
  name text not null,
  kcal_per_100g numeric not null default 0,
  protein_per_100g numeric not null default 0,
  carbs_per_100g numeric not null default 0,
  fibre_per_100g numeric not null default 0,
  source text not null default 'generic estimate',
  estimated boolean not null default true,
  updated_at timestamptz not null default now()
);
create table if not exists public.gather_ingredient_aliases (
  alias text primary key,
  ingredient_id text not null references public.gather_ingredient_catalog(id) on delete cascade
);
create table if not exists public.gather_daily_plan_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  member text not null,
  plan_date date not null,
  section text not null default 'Today',
  item_kind text not null default 'recipe',
  recipe_id text,
  name text not null,
  quantity numeric not null default 1,
  portion_mode text,
  kcal numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fibre_g numeric not null default 0,
  ingredient_quantities numeric[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
create table if not exists public.gather_saved_meals (
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_id text not null,
  member text,
  meal_date date,
  name text not null,
  meal_kind text,
  section text,
  created_at timestamptz,
  updated_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb,
  primary key (user_id, meal_id)
);
create table if not exists public.gather_saved_meal_items (
  user_id uuid not null,
  meal_id text not null,
  position integer not null,
  item_id text,
  item_kind text,
  recipe_id text,
  name text not null default '',
  quantity numeric not null default 1,
  portion_mode text,
  kcal numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fibre_g numeric not null default 0,
  ingredient_quantities numeric[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  primary key (user_id, meal_id, position),
  foreign key (user_id, meal_id) references public.gather_saved_meals(user_id, meal_id) on delete cascade
);
create table if not exists public.gather_current_meal_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  recipe_id text,
  member text,
  meal_date date,
  meal_type text,
  quantity numeric not null default 1,
  details jsonb not null default '{}'::jsonb,
  primary key (user_id, item_id)
);
create table if not exists public.gather_pantry_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  name text not null,
  quantity numeric,
  unit text,
  details jsonb not null default '{}'::jsonb,
  primary key (user_id, item_id)
);
create table if not exists public.gather_user_settings (
  user_id uuid not null references auth.users(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, setting_key)
);

-- Every exposed table is owner-scoped (the ingredient reference data is readable by signed-in users).
do $$ declare t text; begin
  foreach t in array array['gather_recipes','gather_recipe_ingredients','gather_recipe_steps','gather_daily_plan_items','gather_saved_meals','gather_saved_meal_items','gather_current_meal_items','gather_pantry_items','gather_user_settings'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('drop policy if exists owner_all on public.%I',t);
    execute format('create policy owner_all on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)',t);
  end loop;
end $$;
alter table public.gather_ingredient_catalog enable row level security;
drop policy if exists signed_in_read on public.gather_ingredient_catalog;
create policy signed_in_read on public.gather_ingredient_catalog for select to authenticated using (true);
alter table public.gather_ingredient_aliases enable row level security;
drop policy if exists signed_in_read on public.gather_ingredient_aliases;
create policy signed_in_read on public.gather_ingredient_aliases for select to authenticated using (true);

-- Idempotent migration from the previous JSON table. Keep that source untouched for rollback.
insert into public.gather_recipes(user_id,recipe_id,name,category,servings,prep_minutes,portion_mode,cooked_yield_grams,cover_image,cover_offset_x,cover_offset_y,cover_zoom,video_url,notes,legacy_rolls,extra)
select s.user_id, r->>'id', coalesce(r->>'name','Untitled recipe'), coalesce(r->>'category','Mains'), coalesce(nullif(r->>'servings','')::numeric,1), nullif(r->>'time','')::numeric, r->>'portionMode', nullif(r->>'cookedYieldGrams','')::numeric, r->>'coverImage', nullif(r->>'coverOffsetX','')::numeric, nullif(r->>'coverOffsetY','')::numeric, nullif(r->>'coverZoom','')::numeric, r->>'videoUrl', r->>'notes', coalesce((r->>'legacyRolls')::boolean,false), r - array['id','name','category','servings','time','portionMode','cookedYieldGrams','coverImage','coverOffsetX','coverOffsetY','coverZoom','videoUrl','notes','legacyRolls','ingredients','steps','stepImages']::text[]
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) r where s.state_key='recipes'
on conflict(user_id,recipe_id) do nothing;
insert into public.gather_recipe_ingredients(user_id,recipe_id,position,name,quantity,unit,kcal,protein_g,carbs_g,fibre_g,photo,nutrition_source,verified,catalog_id,kcal_per_unit,protein_per_unit,carbs_per_unit,fibre_per_unit,extra)
select s.user_id,r->>'id',i.ord-1,coalesce(i.value->>0,''),coalesce(nullif(i.value->>1,'')::numeric,0),coalesce(i.value->>2,'g'),coalesce(nullif(i.value->>3,'')::numeric,0),coalesce(nullif(i.value->>4,'')::numeric,0),coalesce(nullif(i.value->>5,'')::numeric,0),coalesce(nullif(i.value->>6,'')::numeric,0),i.value->>7,i.value->>8,coalesce((i.value->>9)::boolean,false),i.value->>10,nullif(i.value->>11,'')::numeric,nullif(i.value->>12,'')::numeric,nullif(i.value->>13,'')::numeric,nullif(i.value->>14,'')::numeric,'{}'::jsonb
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) r cross join lateral jsonb_array_elements(r->'ingredients') with ordinality i(value,ord) where s.state_key='recipes'
on conflict(user_id,recipe_id,position) do nothing;
insert into public.gather_recipe_steps(user_id,recipe_id,position,instruction,image)
select s.user_id,r->>'id',st.ord-1,st.value#>>'{}',r->'stepImages'->>(st.ord::int-1)
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) r cross join lateral jsonb_array_elements(r->'steps') with ordinality st(value,ord) where s.state_key='recipes'
on conflict(user_id,recipe_id,position) do nothing;

insert into public.gather_daily_plan_items(user_id,item_id,member,plan_date,section,item_kind,recipe_id,name,quantity,portion_mode,kcal,protein_g,carbs_g,fibre_g,ingredient_quantities,details)
select s.user_id,coalesce(i->>'uid',md5(k||i::text)),split_part(k,'|',1),split_part(k,'|',2)::date,coalesce(i->>'section','Today'),coalesce(i->>'kind','recipe'),i->>'recipeId',coalesce(i->>'name','Food'),coalesce(nullif(i->>'count','')::numeric,1),i->>'portionMode',coalesce(nullif(i->>'kcal','')::numeric,0),coalesce(nullif(i->>'protein','')::numeric,0),coalesce(nullif(i->>'carbs','')::numeric,0),coalesce(nullif(i->>'fiber','')::numeric,0),coalesce(array(select jsonb_array_elements_text(i->'ingredientQtys')::numeric),'{}'::numeric[]),i-'uid'-'section'-'kind'-'recipeId'-'name'-'count'-'portionMode'-'kcal'-'protein'-'carbs'-'fiber'-'ingredientQtys'
from public.gather_app_state s cross join lateral jsonb_each(s.state) p(k,v) cross join lateral jsonb_array_elements(p.v) i where s.state_key='daily-plans'
on conflict(user_id,item_id) do nothing;
insert into public.gather_saved_meals(user_id,meal_id,member,meal_date,name,meal_kind,section,created_at,updated_at,details)
select s.user_id,coalesce(m->>'id',md5(m::text)),m->>'member',nullif(m->>'date','')::date,coalesce(m->>'name','Saved meal'),m->>'kind',m->>'section',nullif(m->>'createdAt','')::timestamptz,coalesce(nullif(m->>'updatedAt','')::timestamptz,now()),m-'id'-'member'-'date'-'name'-'kind'-'section'-'createdAt'-'updatedAt'-'items'
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) m where s.state_key='saved-meals'
on conflict(user_id,meal_id) do nothing;
insert into public.gather_saved_meal_items(user_id,meal_id,position,item_id,item_kind,recipe_id,name,quantity,portion_mode,kcal,protein_g,carbs_g,fibre_g,ingredient_quantities,details)
select s.user_id,coalesce(m->>'id',md5(m::text)),it.ord-1,it.value->>'uid',it.value->>'kind',it.value->>'recipeId',coalesce(it.value->>'name','Food'),coalesce(nullif(it.value->>'count','')::numeric,1),it.value->>'portionMode',coalesce(nullif(it.value->>'kcal','')::numeric,0),coalesce(nullif(it.value->>'protein','')::numeric,0),coalesce(nullif(it.value->>'carbs','')::numeric,0),coalesce(nullif(it.value->>'fiber','')::numeric,0),coalesce(array(select jsonb_array_elements_text(it.value->'ingredientQtys')::numeric),'{}'::numeric[]),it.value-'uid'-'kind'-'recipeId'-'name'-'count'-'portionMode'-'kcal'-'protein'-'carbs'-'fiber'-'ingredientQtys'
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) m cross join lateral jsonb_array_elements(m->'items') with ordinality it(value,ord) where s.state_key='saved-meals'
on conflict(user_id,meal_id,position) do nothing;
insert into public.gather_current_meal_items(user_id,item_id,recipe_id,member,meal_date,meal_type,quantity,details)
select s.user_id,coalesce(i->>'id',md5(i::text))||'|'||coalesce(i->>'member','Mitali'),i->>'id',i->>'member',nullif(i->>'mealDate','')::date,i->>'mealType',coalesce(nullif(i->>'count','')::numeric,1),i-'id'-'member'-'mealDate'-'mealType'-'count'
from public.gather_app_state s cross join lateral jsonb_array_elements(s.state) i where s.state_key='current-meal'
on conflict(user_id,item_id) do nothing;
insert into public.gather_user_settings(user_id,setting_key,setting_value)
select user_id,'calorie-goals',state from public.gather_app_state where state_key='calorie-goals' on conflict(user_id,setting_key) do nothing;

create index if not exists gather_daily_plan_lookup on public.gather_daily_plan_items(user_id,member,plan_date);
create index if not exists gather_saved_meals_lookup on public.gather_saved_meals(user_id,member,meal_date desc);
create index if not exists gather_recipe_names on public.gather_recipes(user_id,name);
