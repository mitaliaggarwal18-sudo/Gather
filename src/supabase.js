import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null;

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

const rowsToRecipe = (row, ingredients, steps) => ({
  ...row.extra,
  id: row.recipe_id,
  name: row.name,
  category: row.category,
  servings: Number(row.servings) || 1,
  time: row.prep_minutes == null ? undefined : Number(row.prep_minutes),
  portionMode: row.portion_mode,
  cookedYieldGrams: row.cooked_yield_grams == null ? undefined : Number(row.cooked_yield_grams),
  coverImage: row.cover_image || "",
  coverOffsetX: row.cover_offset_x == null ? undefined : Number(row.cover_offset_x),
  coverOffsetY: row.cover_offset_y == null ? undefined : Number(row.cover_offset_y),
  coverZoom: row.cover_zoom == null ? undefined : Number(row.cover_zoom),
  videoUrl: row.video_url || "",
  notes: row.notes || "",
  legacyRolls: row.legacy_rolls,
  ingredients: ingredients.sort((a,b)=>a.position-b.position).map(i=>[
    i.name, Number(i.quantity), i.unit, Number(i.kcal), Number(i.protein_g), Number(i.carbs_g), Number(i.fibre_g),
    i.photo, i.nutrition_source, i.verified, i.catalog_id, i.kcal_per_unit, i.protein_per_unit, i.carbs_per_unit, i.fibre_per_unit,
  ]),
  steps: steps.sort((a,b)=>a.position-b.position).map(s=>s.instruction),
  stepImages: Object.fromEntries(steps.filter(s=>s.image).map(s=>[s.position,s.image])),
});

export async function loadGatherData(userId) {
  const tables = ["gather_recipes","gather_recipe_ingredients","gather_recipe_steps","gather_daily_plan_items","gather_saved_meals","gather_saved_meal_items","gather_current_meal_items","gather_pantry_items","gather_user_settings","gather_ingredient_catalog","gather_ingredient_aliases"];
  const results = await Promise.all(tables.map(table=>table.startsWith("gather_ingredient_")?supabase.from(table).select("*"):supabase.from(table).select("*").eq("user_id",userId)));
  const byTable = Object.fromEntries(results.map((result,index)=>[tables[index],result]));
  for (const table of tables.slice(0,9)) if (byTable[table]?.error) throw byTable[table].error;
  const read = name => byTable[name]?.data || [];
  const ingredients=read("gather_recipe_ingredients"),steps=read("gather_recipe_steps");
  const recipes=read("gather_recipes").map(r=>rowsToRecipe(r,ingredients.filter(i=>i.recipe_id===r.recipe_id),steps.filter(s=>s.recipe_id===r.recipe_id)));
  const dailyPlans={};
  for(const i of read("gather_daily_plan_items")){
    const key=`${i.member}|${i.plan_date}`;
    (dailyPlans[key] ||= []).push({...i.details,uid:i.item_id,kind:i.item_kind,recipeId:i.recipe_id,name:i.name,section:i.section,count:Number(i.quantity),portionMode:i.portion_mode,kcal:Number(i.kcal),protein:Number(i.protein_g),carbs:Number(i.carbs_g),fiber:Number(i.fibre_g),ingredientQtys:i.ingredient_quantities||[]});
  }
  const itemRows=read("gather_saved_meal_items");
  const savedMeals=read("gather_saved_meals").map(m=>({...m.details,id:m.meal_id,member:m.member,date:m.meal_date,name:m.name,kind:m.meal_kind,section:m.section,createdAt:m.created_at,updatedAt:m.updated_at,items:itemRows.filter(i=>i.meal_id===m.meal_id).sort((a,b)=>a.position-b.position).map(i=>({...i.details,uid:i.item_id,kind:i.item_kind,recipeId:i.recipe_id,name:i.name,count:Number(i.quantity),portionMode:i.portion_mode,kcal:Number(i.kcal),protein:Number(i.protein_g),carbs:Number(i.carbs_g),fiber:Number(i.fibre_g),ingredientQtys:i.ingredient_quantities||[]}))}));
  const currentMeal=read("gather_current_meal_items").map(i=>({...i.details,id:i.recipe_id,member:i.member,mealDate:i.meal_date,mealType:i.meal_type,count:Number(i.quantity)}));
  const settings=read("gather_user_settings").find(x=>x.setting_key==="calorie-goals")?.setting_value || {Mitali:1600,Abhinav:2000};
  const pantryStock=Object.fromEntries(read("gather_pantry_items").map(i=>[i.item_id,{...i.details,name:i.name,quantity:Number(i.quantity)||0,unit:i.unit||"g"}]));
  return {recipes,dailyPlans,savedMeals,currentMeal,pantryStock,calorieGoals:settings,ingredientCatalog:byTable.gather_ingredient_catalog?.data||[],ingredientAliases:byTable.gather_ingredient_aliases?.data||[]};
}

const itemColumns=(user_id,item)=>({user_id,item_id:item.uid,member:item.member,plan_date:item.planDate,section:item.section||"Today",item_kind:item.kind||"recipe",recipe_id:item.recipeId||null,name:item.name||"Food",quantity:Number(item.count)||1,portion_mode:item.portionMode||null,kcal:Number(item.kcal)||0,protein_g:Number(item.protein)||0,carbs_g:Number(item.carbs)||0,fibre_g:Number(item.fiber)||0,ingredient_quantities:item.ingredientQtys||[],details:Object.fromEntries(Object.entries(item).filter(([k])=>!['uid','member','planDate','section','kind','recipeId','name','count','portionMode','kcal','protein','carbs','fiber','ingredientQtys'].includes(k))) });

export async function saveGatherData(userId, state) {
  const write = async (table, rows) => { const {error}=await supabase.from(table).upsert(rows); if(error)throw error; };
  const delUser=async table=>{const {error}=await supabase.from(table).delete().eq("user_id",userId);if(error)throw error;};
  const recipeRows=state.recipes.map(r=>({user_id:userId,recipe_id:String(r.id),name:r.name||"Untitled recipe",category:r.category||"Mains",servings:Number(r.servings)||1,prep_minutes:r.time??null,portion_mode:r.portionMode||null,cooked_yield_grams:r.cookedYieldGrams??null,cover_image:r.coverImage||null,cover_offset_x:r.coverOffsetX??null,cover_offset_y:r.coverOffsetY??null,cover_zoom:r.coverZoom??null,video_url:r.videoUrl||null,notes:r.notes||null,legacy_rolls:!!r.legacyRolls,extra:Object.fromEntries(Object.entries(r).filter(([k])=>!['id','name','category','servings','time','portionMode','cookedYieldGrams','coverImage','coverOffsetX','coverOffsetY','coverZoom','videoUrl','notes','legacyRolls','ingredients','steps','stepImages'].includes(k)))}));
  const {data:existingRecipes,error:existingError}=await supabase.from("gather_recipes").select("recipe_id").eq("user_id",userId);if(existingError)throw existingError;
  const keep=new Set(recipeRows.map(r=>r.recipe_id));
  for(const row of existingRecipes||[])if(!keep.has(row.recipe_id)){const {error}=await supabase.from("gather_recipes").delete().eq("user_id",userId).eq("recipe_id",row.recipe_id);if(error)throw error;}
  await delUser("gather_recipe_steps"); await delUser("gather_recipe_ingredients");
  await write("gather_recipes",recipeRows);
  const ing=state.recipes.flatMap(r=>(r.ingredients||[]).map((i,position)=>({user_id:userId,recipe_id:String(r.id),position,name:i[0]||"",quantity:Number(i[1])||0,unit:i[2]||"g",kcal:Number(i[3])||0,protein_g:Number(i[4])||0,carbs_g:Number(i[5])||0,fibre_g:Number(i[6])||0,photo:i[7]||null,nutrition_source:i[8]||null,verified:!!i[9],catalog_id:i[10]||null,kcal_per_unit:i[11]??null,protein_per_unit:i[12]??null,carbs_per_unit:i[13]??null,fibre_per_unit:i[14]??null})));
  if(ing.length)await write("gather_recipe_ingredients",ing);
  const stepRows=state.recipes.flatMap(r=>(r.steps||[]).map((instruction,position)=>({user_id:userId,recipe_id:String(r.id),position,instruction,image:r.stepImages?.[position]||null})));
  if(stepRows.length)await write("gather_recipe_steps",stepRows);
  await delUser("gather_daily_plan_items");
  const planRows=Object.entries(state.dailyPlans).flatMap(([key,items])=>{const [member,planDate]=key.split("|");return items.map(item=>({...itemColumns(userId,{...item,member,planDate}),updated_at:new Date().toISOString()}))});
  if(planRows.length)await write("gather_daily_plan_items",planRows);
  await delUser("gather_saved_meals");
  const mealRows=state.savedMeals.map(m=>({user_id:userId,meal_id:String(m.id),member:m.member||null,meal_date:m.date||null,name:m.name||"Saved meal",meal_kind:m.kind||null,section:m.section||null,created_at:m.createdAt||null,updated_at:m.updatedAt||new Date().toISOString(),details:Object.fromEntries(Object.entries(m).filter(([k])=>!['id','member','date','name','kind','section','createdAt','updatedAt','items'].includes(k)))}));
  if(mealRows.length)await write("gather_saved_meals",mealRows);
  const savedItems=state.savedMeals.flatMap(m=>(m.items||[]).map((i,position)=>({user_id:userId,meal_id:String(m.id),position,item_id:i.uid||null,item_kind:i.kind||null,recipe_id:i.recipeId||null,name:i.name||"Food",quantity:Number(i.count)||1,portion_mode:i.portionMode||null,kcal:Number(i.kcal)||0,protein_g:Number(i.protein)||0,carbs_g:Number(i.carbs)||0,fibre_g:Number(i.fiber)||0,ingredient_quantities:i.ingredientQtys||[],details:Object.fromEntries(Object.entries(i).filter(([k])=>!['uid','kind','recipeId','name','count','portionMode','kcal','protein','carbs','fiber','ingredientQtys'].includes(k)))})));
  if(savedItems.length)await write("gather_saved_meal_items",savedItems);
  await delUser("gather_current_meal_items");
  const current=state.currentMeal.map(i=>({user_id:userId,item_id:`${i.id}|${i.member||"Mitali"}`,recipe_id:i.id,member:i.member||null,meal_date:i.mealDate||null,meal_type:i.mealType||null,quantity:Number(i.count)||1,details:Object.fromEntries(Object.entries(i).filter(([k])=>!['id','member','mealDate','mealType','count'].includes(k)))}));
  if(current.length)await write("gather_current_meal_items",current);
  await delUser("gather_pantry_items");
  const pantry=Object.entries(state.pantryStock||{}).map(([item_id,i])=>({user_id:userId,item_id,name:i.name||item_id,quantity:Number(i.quantity)||0,unit:i.unit||"g",details:Object.fromEntries(Object.entries(i).filter(([k])=>!['name','quantity','unit'].includes(k)))}));
  if(pantry.length)await write("gather_pantry_items",pantry);
  await write("gather_user_settings",[{user_id:userId,setting_key:"calorie-goals",setting_value:state.calorieGoals,updated_at:new Date().toISOString()}]);
}
