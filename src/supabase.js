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
