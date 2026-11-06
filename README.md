# Gather — Recipe & Meal Planner

A mobile-first React + Vite meal planner, recipe book, meal history, and pantry checklist.

## Run locally
1. Install Node.js (18+).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.

## Features
- Seeded vegetarian recipes with ingredient lists, estimated nutrition, servings and cooking steps.
- Recipe search and category filters.
- Add, edit, duplicate and delete recipes.
- Ingredient quantities and per-batch nutrition can be edited when creating or updating a recipe.
- Daily Planner is the landing page, with separate planning for Mitali and Abhinav.
- Save a complete planner meal, including recipes and outside foods, to an editable meal history.
- Pantry checklist derives recipe ingredient needs from planned servings and subtracts recorded supplies.
- Add recipes from the planner; dictate or describe a recipe and use AI to fill editable fields.
- AI nutrition estimates for ingredients and foods not found in the food database.
- Nutrition overview and per-serving recipe estimates.
- Supabase cloud sync for recipes, meal history, daily plans, pantry, goals and the current meal, with JSON export/import backup.

## Notes
- Nutrition values are estimates, not laboratory values. Enter the values from your product labels for better accuracy.
- Some quantities in recipes where exact amounts were not available are starter estimates and should be checked against the way you cook.
- Cloud sync uses Supabase email sign-in. The first sign-in merges local browser recipes and meal records into the account; signing into the same account on either Gather URL syncs them across devices. Use Export backup / Import backup as an additional recovery option.
- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for local development; the Vercel project has these set for its deployment environments. The `gather_app_state` table uses row-level security so each signed-in account can access only its own data.
- Pantry totals are calculated from recipes with known ingredient quantities. Outside foods without ingredient amounts are included in meal nutrition and history, but cannot produce exact pantry requirements.
- AI-generated recipe quantities and nutrition are estimates. Review them before saving. Voice dictation uses microphone access and the OpenAI transcription endpoint; the API key stays server-side in Vercel environment variables.
- Passwordless sign-in redirects must be allowlisted in Supabase for each deployed Gather URL.
