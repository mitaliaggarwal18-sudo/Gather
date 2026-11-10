-- Atomic, owner-scoped save; version checks prevent a second device silently
-- replacing newer edits. Recipe photos live in a private Storage bucket.
create table if not exists public.gather_user_data_versions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version bigint not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.gather_user_data_versions enable row level security;
drop policy if exists owner_all on public.gather_user_data_versions;
create policy owner_all on public.gather_user_data_versions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.gather_ai_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0
);
alter table public.gather_ai_usage enable row level security;
drop policy if exists owner_read on public.gather_ai_usage;
create policy owner_read on public.gather_ai_usage for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.gather_ai_usage from anon, authenticated;

create or replace function public.consume_gather_ai_quota()
returns integer language plpgsql security definer set search_path = '' as $$
declare v_user uuid := (select auth.uid()); v_count integer;
begin
  if v_user is null then raise exception 'authentication required' using errcode = '42501'; end if;
  insert into public.gather_ai_usage(user_id, window_started_at, request_count)
  values (v_user, now(), 1)
  on conflict (user_id) do update set
    window_started_at = case when public.gather_ai_usage.window_started_at < now() - interval '1 hour' then now() else public.gather_ai_usage.window_started_at end,
    request_count = case when public.gather_ai_usage.window_started_at < now() - interval '1 hour' then 1 else public.gather_ai_usage.request_count + 1 end
  returning request_count into v_count;
  return v_count;
end $$;
grant execute on function public.consume_gather_ai_quota() to authenticated;
revoke execute on function public.consume_gather_ai_quota() from anon, public;

create or replace function public.save_gather_data(
  p_expected_version bigint,
  p_recipes jsonb,
  p_daily_plans jsonb,
  p_saved_meals jsonb,
  p_current_meal jsonb,
  p_pantry jsonb,
  p_calorie_goals jsonb
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare
  v_user uuid := (select auth.uid()); v_version bigint; v_recipe jsonb; v_item jsonb; v_meal jsonb; v_entry record;
begin
  if v_user is null then raise exception 'authentication required' using errcode = '42501'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text, 0));
  insert into public.gather_user_data_versions(user_id, version) values (v_user, 0) on conflict (user_id) do nothing;
  select version into v_version from public.gather_user_data_versions where user_id=v_user for update;
  if v_version <> p_expected_version then raise exception 'Gather data changed on another device. Reload before saving.' using errcode = '40001'; end if;

  delete from public.gather_recipe_ingredients where user_id=v_user;
  delete from public.gather_recipe_steps where user_id=v_user;
  delete from public.gather_recipes where user_id=v_user;
  delete from public.gather_daily_plan_items where user_id=v_user;
  delete from public.gather_saved_meals where user_id=v_user;
  delete from public.gather_current_meal_items where user_id=v_user;
  delete from public.gather_pantry_items where user_id=v_user;
  delete from public.gather_user_settings where user_id=v_user;

  for v_recipe in select value from jsonb_array_elements(coalesce(p_recipes,'[]'::jsonb)) loop
    insert into public.gather_recipes(user_id,recipe_id,name,category,servings,prep_minutes,portion_mode,cooked_yield_grams,cover_image,cover_offset_x,cover_offset_y,cover_zoom,video_url,notes,legacy_rolls,extra)
    values(v_user,v_recipe->>'id',coalesce(v_recipe->>'name','Untitled recipe'),coalesce(v_recipe->>'category','Mains'),coalesce(nullif(v_recipe->>'servings','')::numeric,1),nullif(v_recipe->>'time','')::numeric,v_recipe->>'portionMode',nullif(v_recipe->>'cookedYieldGrams','')::numeric,v_recipe->>'coverImage',nullif(v_recipe->>'coverOffsetX','')::numeric,nullif(v_recipe->>'coverOffsetY','')::numeric,nullif(v_recipe->>'coverZoom','')::numeric,v_recipe->>'videoUrl',v_recipe->>'notes',coalesce((v_recipe->>'legacyRolls')::boolean,false),v_recipe-array['id','name','category','servings','time','portionMode','cookedYieldGrams','coverImage','coverOffsetX','coverOffsetY','coverZoom','videoUrl','notes','legacyRolls','ingredients','steps','stepImages']::text[]);
    insert into public.gather_recipe_ingredients(user_id,recipe_id,position,name,quantity,unit,kcal,protein_g,carbs_g,fibre_g,photo,nutrition_source,verified,catalog_id,kcal_per_unit,protein_per_unit,carbs_per_unit,fibre_per_unit,extra)
    select v_user,v_recipe->>'id',(i.ordinality-1)::integer,coalesce(i.value->>0,''),coalesce(nullif(i.value->>1,'')::numeric,0),coalesce(i.value->>2,'g'),coalesce(nullif(i.value->>3,'')::numeric,0),coalesce(nullif(i.value->>4,'')::numeric,0),coalesce(nullif(i.value->>5,'')::numeric,0),coalesce(nullif(i.value->>6,'')::numeric,0),i.value->>7,i.value->>8,coalesce((i.value->>9)::boolean,false),i.value->>10,nullif(i.value->>11,'')::numeric,nullif(i.value->>12,'')::numeric,nullif(i.value->>13,'')::numeric,nullif(i.value->>14,'')::numeric,'{}'::jsonb
    from jsonb_array_elements(coalesce(v_recipe->'ingredients','[]'::jsonb)) with ordinality i(value,ordinality);
    insert into public.gather_recipe_steps(user_id,recipe_id,position,instruction,image)
    select v_user,v_recipe->>'id',(s.ordinality-1)::integer,s.value#>>'{}',v_recipe->'stepImages'->>((s.ordinality-1)::text)
    from jsonb_array_elements(coalesce(v_recipe->'steps','[]'::jsonb)) with ordinality s(value,ordinality);
  end loop;

  for v_entry in select key, value from jsonb_each(coalesce(p_daily_plans,'{}'::jsonb)) loop
    for v_item in select value from jsonb_array_elements(v_entry.value) loop
      insert into public.gather_daily_plan_items(user_id,item_id,member,plan_date,section,item_kind,recipe_id,name,quantity,portion_mode,kcal,protein_g,carbs_g,fibre_g,ingredient_quantities,details)
      values(v_user,coalesce(v_item->>'uid',md5(v_item::text)),split_part(v_entry.key,'|',1),split_part(v_entry.key,'|',2)::date,coalesce(v_item->>'section','Today'),coalesce(v_item->>'kind','recipe'),v_item->>'recipeId',coalesce(v_item->>'name','Food'),coalesce(nullif(v_item->>'count','')::numeric,1),v_item->>'portionMode',coalesce(nullif(v_item->>'kcal','')::numeric,0),coalesce(nullif(v_item->>'protein','')::numeric,0),coalesce(nullif(v_item->>'carbs','')::numeric,0),coalesce(nullif(v_item->>'fiber','')::numeric,0),coalesce(array(select jsonb_array_elements_text(v_item->'ingredientQtys')::numeric),'{}'::numeric[]),v_item-'uid'-'section'-'kind'-'recipeId'-'name'-'count'-'portionMode'-'kcal'-'protein'-'carbs'-'fiber'-'ingredientQtys');
    end loop;
  end loop;

  for v_meal in select value from jsonb_array_elements(coalesce(p_saved_meals,'[]'::jsonb)) loop
    insert into public.gather_saved_meals(user_id,meal_id,member,meal_date,name,meal_kind,section,created_at,updated_at,details)
    values(v_user,v_meal->>'id',v_meal->>'member',nullif(v_meal->>'date','')::date,coalesce(v_meal->>'name','Saved meal'),v_meal->>'kind',v_meal->>'section',coalesce(nullif(v_meal->>'createdAt','')::timestamptz,now()),coalesce(nullif(v_meal->>'updatedAt','')::timestamptz,now()),v_meal-'id'-'member'-'date'-'name'-'kind'-'section'-'createdAt'-'updatedAt'-'items'-'rows');
    for v_item in select value from jsonb_array_elements(coalesce(v_meal->'items','[]'::jsonb)) loop
      insert into public.gather_saved_meal_items(user_id,meal_id,position,item_id,item_kind,recipe_id,name,quantity,portion_mode,kcal,protein_g,carbs_g,fibre_g,ingredient_quantities,details)
      values(v_user,v_meal->>'id',(select count(*)::integer from public.gather_saved_meal_items where user_id=v_user and meal_id=v_meal->>'id'),v_item->>'uid',v_item->>'kind',v_item->>'recipeId',coalesce(v_item->>'name','Food'),coalesce(nullif(v_item->>'count','')::numeric,1),v_item->>'portionMode',coalesce(nullif(v_item->>'kcal','')::numeric,0),coalesce(nullif(v_item->>'protein','')::numeric,0),coalesce(nullif(v_item->>'carbs','')::numeric,0),coalesce(nullif(v_item->>'fiber','')::numeric,0),coalesce(array(select jsonb_array_elements_text(v_item->'ingredientQtys')::numeric),'{}'::numeric[]),v_item-'uid'-'kind'-'recipeId'-'name'-'count'-'portionMode'-'kcal'-'protein'-'carbs'-'fiber'-'ingredientQtys');
    end loop;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_current_meal,'[]'::jsonb)) loop
    insert into public.gather_current_meal_items(user_id,item_id,recipe_id,member,meal_date,meal_type,quantity,details)
    values(v_user,coalesce(v_item->>'id','item')||'|'||coalesce(v_item->>'member','Mitali')||'|'||coalesce(v_item->>'variant',''),v_item->>'id',v_item->>'member',nullif(v_item->>'mealDate','')::date,v_item->>'mealType',coalesce(nullif(v_item->>'count','')::numeric,1),v_item-'id'-'member'-'mealDate'-'mealType'-'count');
  end loop;
  for v_entry in select key,value from jsonb_each(coalesce(p_pantry,'{}'::jsonb)) loop
    insert into public.gather_pantry_items(user_id,item_id,name,quantity,unit,details)
    values(v_user,v_entry.key,coalesce(v_entry.value->>'name',v_entry.key),nullif(v_entry.value->>'quantity','')::numeric,v_entry.value->>'unit',v_entry.value-'name'-'quantity'-'unit');
  end loop;
  insert into public.gather_user_settings(user_id,setting_key,setting_value) values(v_user,'calorie-goals',coalesce(p_calorie_goals,'{}'::jsonb));
  update public.gather_user_data_versions set version=version+1,updated_at=now() where user_id=v_user returning version into v_version;
  return v_version;
end $$;
grant execute on function public.save_gather_data(bigint,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb) to authenticated;
revoke execute on function public.save_gather_data(bigint,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb) from anon, public;

create index if not exists gather_ingredient_aliases_ingredient_id_idx on public.gather_ingredient_aliases(ingredient_id);
do $$ declare t text; begin
  foreach t in array array['gather_recipes','gather_recipe_ingredients','gather_recipe_steps','gather_daily_plan_items','gather_saved_meals','gather_saved_meal_items','gather_current_meal_items','gather_pantry_items','gather_user_settings'] loop
    execute format('drop policy if exists owner_all on public.%I',t);
    execute format('create policy owner_all on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',t);
  end loop;
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('gather-recipe-media','gather-recipe-media',false,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists gather_recipe_media_select on storage.objects;
create policy gather_recipe_media_select on storage.objects for select to authenticated using (bucket_id='gather-recipe-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists gather_recipe_media_insert on storage.objects;
create policy gather_recipe_media_insert on storage.objects for insert to authenticated with check (bucket_id='gather-recipe-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists gather_recipe_media_update on storage.objects;
create policy gather_recipe_media_update on storage.objects for update to authenticated using (bucket_id='gather-recipe-media' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='gather-recipe-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
