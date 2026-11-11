import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null;

export async function authenticatedFetch(input, init = {}) {
  if (!supabase) throw new Error("Sign in to use this feature.");
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("Sign in again to use this feature.");
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers });
}

export function mergeState(key, cloudValue, localValue) {
  if (cloudValue == null) return localValue;
  if (localValue == null) return cloudValue;

  if (key === "recipes" || key === "saved-meals" || key === "current-meal") {
    const idOf = item => key === "current-meal"
      ? `${item.id}|${item.member || "Mitali"}|${item.variant || ""}`
      : item.id;
    const merged = new Map((Array.isArray(cloudValue) ? cloudValue : []).map(item => [idOf(item), item]));
    for (const item of Array.isArray(localValue) ? localValue : []) merged.set(idOf(item), item);
    return [...merged.values()];
  }

  if (key === "daily-plans") {
    const merged = { ...(cloudValue || {}) };
    for (const [date, localItems] of Object.entries(localValue || {})) {
      const items = new Map((merged[date] || []).map(item => [item.uid, item]));
      for (const item of localItems || []) items.set(item.uid, item);
      merged[date] = [...items.values()];
    }
    return merged;
  }

  if (key === "pantry" || key === "calorie-goals") return { ...cloudValue, ...localValue };
  return localValue;
}

const dataVersions = new Map();
const saveQueues = new Map();
const mediaBucket = "gather-recipe-media";

function stableImageReference(value) {
  if (!value) return null;
  if (value.startsWith("storage://")) return value;
  try {
    const url = new URL(value);
    for (const access of ["sign", "public"]) {
      const marker = `/storage/v1/object/${access}/${mediaBucket}/`;
      const index = url.pathname.indexOf(marker);
      if (index >= 0) return `storage://${decodeURIComponent(url.pathname.slice(index + marker.length))}`;
    }
  } catch {}
  return value;
}

async function signedImage(value) {
  if (!value?.startsWith("storage://")) return value || "";
  const path=value.slice("storage://".length);
  const {data,error}=await supabase.storage.from(mediaBucket).createSignedUrl(path,60*60*24*7);
  if(error)throw error;
  return data.signedUrl;
}

async function storeImage(userId,recipeId,slot,value) {
  if(!value?.startsWith("data:image/"))return stableImageReference(value);
  const response=await fetch(value),blob=await response.blob(),mime=blob.type||"image/jpeg";
  const extension=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif"})[mime]||"jpg";
  const path=`${userId}/${encodeURIComponent(recipeId)}/${slot}.${extension}`;
  const {error}=await supabase.storage.from(mediaBucket).upload(path,blob,{upsert:true,contentType:mime,cacheControl:"3600"});
  if(error)throw error;
  return `storage://${path}`;
}

const rowsToRecipe = async (row, ingredients, steps) => ({
  ...row.extra,
  id: row.recipe_id,
  name: row.name,
  category: row.category,
  servings: Number(row.servings) || 1,
  time: row.prep_minutes == null ? undefined : Number(row.prep_minutes),
  portionMode: row.portion_mode,
  cookedYieldGrams: row.cooked_yield_grams == null ? undefined : Number(row.cooked_yield_grams),
  coverImage: await signedImage(row.cover_image),
  coverOffsetX: row.cover_offset_x == null ? undefined : Number(row.cover_offset_x),
  coverOffsetY: row.cover_offset_y == null ? undefined : Number(row.cover_offset_y),
  coverZoom: row.cover_zoom == null ? undefined : Number(row.cover_zoom),
  videoUrl: row.video_url || "",
  notes: row.notes || "",
  legacyRolls: row.legacy_rolls,
  ingredients: await Promise.all(ingredients.sort((a,b)=>a.position-b.position).map(async i=>[
    i.name, Number(i.quantity), i.unit, Number(i.kcal), Number(i.protein_g), Number(i.carbs_g), Number(i.fibre_g),
    await signedImage(i.photo), i.nutrition_source, i.verified, i.catalog_id, i.kcal_per_unit, i.protein_per_unit, i.carbs_per_unit, i.fibre_per_unit,
  ])),
  steps: steps.sort((a,b)=>a.position-b.position).map(s=>s.instruction),
  stepImages: Object.fromEntries(await Promise.all(steps.filter(s=>s.image).map(async s=>[s.position,await signedImage(s.image)]))),
});

export async function loadGatherData(userId) {
  const tables = ["gather_recipes","gather_recipe_ingredients","gather_recipe_steps","gather_daily_plan_items","gather_saved_meals","gather_saved_meal_items","gather_current_meal_items","gather_pantry_items","gather_user_settings","gather_user_data_versions","gather_ingredient_catalog","gather_ingredient_aliases"];
  const results = await Promise.all(tables.map(table=>table.startsWith("gather_ingredient_")?supabase.from(table).select("*"):supabase.from(table).select("*").eq("user_id",userId)));
  const byTable = Object.fromEntries(results.map((result,index)=>[tables[index],result]));
  for (const table of tables) if (byTable[table]?.error) throw byTable[table].error;
  const read = name => byTable[name]?.data || [];
  const ingredients=read("gather_recipe_ingredients"),steps=read("gather_recipe_steps");
  const recipes=await Promise.all(read("gather_recipes").map(r=>rowsToRecipe(r,ingredients.filter(i=>i.recipe_id===r.recipe_id),steps.filter(s=>s.recipe_id===r.recipe_id))));
  const dailyPlans={};
  for(const i of read("gather_daily_plan_items")){
    const key=`${i.member}|${i.plan_date}`;
    (dailyPlans[key] ||= []).push({...i.details,uid:i.item_id,kind:i.item_kind,recipeId:i.recipe_id,name:i.name,section:i.section,count:Number(i.quantity),portionMode:i.portion_mode,kcal:Number(i.kcal),protein:Number(i.protein_g),carbs:Number(i.carbs_g),fiber:Number(i.fibre_g),ingredientQtys:i.ingredient_quantities||[]});
  }
  const itemRows=read("gather_saved_meal_items");
  const savedMeals=read("gather_saved_meals").map(m=>({...m.details,id:m.meal_id,member:m.member,date:m.meal_date,name:m.name,kind:m.meal_kind,section:m.section,createdAt:m.created_at,updatedAt:m.updated_at,items:itemRows.filter(i=>i.meal_id===m.meal_id).sort((a,b)=>a.position-b.position).map(i=>({...i.details,uid:i.item_id,kind:i.item_kind,recipeId:i.recipe_id,name:i.name,count:Number(i.quantity),portionMode:i.portion_mode,kcal:Number(i.kcal),protein:Number(i.protein_g),carbs:Number(i.carbs_g),fiber:Number(i.fibre_g),ingredientQtys:i.ingredient_quantities||[]}))}));
  const currentMeal=read("gather_current_meal_items").map(i=>({...i.details,id:i.recipe_id,member:i.member,mealDate:i.meal_date,mealType:i.meal_type,count:Number(i.quantity)}));
  const settings=read("gather_user_settings").find(x=>x.setting_key==="calorie-goals")?.setting_value || {Mitali:1600,Abhinav:2000};
  dataVersions.set(userId,Number(read("gather_user_data_versions")[0]?.version)||0);
  const pantryStock=Object.fromEntries(read("gather_pantry_items").map(i=>[i.item_id,{...i.details,name:i.name,quantity:Number(i.quantity)||0,unit:i.unit||"g"}]));
  return {recipes,dailyPlans,savedMeals,currentMeal,pantryStock,calorieGoals:settings,ingredientCatalog:byTable.gather_ingredient_catalog?.data||[],ingredientAliases:byTable.gather_ingredient_aliases?.data||[]};
}

export async function saveGatherData(userId, state) {
  const prior=saveQueues.get(userId)||Promise.resolve();
  const task=prior.catch(()=>{}).then(async()=>{
    const recipes=await Promise.all(state.recipes.map(async r=>({
      ...r,
      coverImage:await storeImage(userId,r.id,"cover",r.coverImage),
      stepImages:Object.fromEntries(await Promise.all(Object.entries(r.stepImages||{}).map(async([step,image])=>[step,await storeImage(userId,r.id,`step-${Number(step)+1}`,image)]))),
      ingredients:await Promise.all((r.ingredients||[]).map(async(i,index)=>{const next=[...i];next[7]=await storeImage(userId,r.id,`ingredient-${index+1}`,i[7]);return next;})),
    })));
    const {data,error}=await supabase.rpc("save_gather_data",{
      p_expected_version:dataVersions.get(userId)||0,
      p_recipes:recipes,
      p_daily_plans:state.dailyPlans,
      p_saved_meals:state.savedMeals,
      p_current_meal:state.currentMeal,
      p_pantry:state.pantryStock,
      p_calorie_goals:state.calorieGoals,
    });
    if(error)throw error;
    dataVersions.set(userId,Number(data));
    return Number(data);
  });
  saveQueues.set(userId,task);
  task.finally(()=>{if(saveQueues.get(userId)===task)saveQueues.delete(userId)}).catch(()=>{});
  return task;
}
