# Gather — Recipe & Meal Planner

A mobile-first React + Vite meal planner, recipe book, meal history, and pantry checklist.

## Run locally
1. Install Node.js (18+).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.

## Features
- 11 seeded vegetarian recipes with ingredient lists, estimated nutrition, servings and cooking steps.
- Recipe search and category filters.
- Add, edit, duplicate and delete recipes.
- Ingredient quantities and per-batch nutrition can be edited when creating or updating a recipe.
- Daily Planner is the landing page, with separate planning for Mitali and Abhinav.
- Save a complete planner meal, including recipes and outside foods, to an editable meal history.
- Pantry checklist derives recipe ingredient needs from planned servings and subtracts recorded supplies.
- Add recipes from the planner; dictate or describe a recipe and use AI to fill editable fields.
- AI nutrition estimates for ingredients and foods not found in the food database.
- Nutrition overview and per-serving recipe estimates.
- Local browser persistence plus JSON export/import backup.

## Notes
- Nutrition values are estimates, not laboratory values. Enter the values from your product labels for better accuracy.
- Some quantities in recipes where exact amounts were not available are starter estimates and should be checked against the way you cook.
- Recipes, meal plans, history, and pantry supplies are stored in the current browser on the current device. Use Export backup / Import backup to move data between devices. A hosted cross-device version needs a database and deployment.
- Pantry totals are calculated from recipes with known ingredient quantities. Outside foods without ingredient amounts are included in meal nutrition and history, but cannot produce exact pantry requirements.
- AI-generated recipe quantities and nutrition are estimates. Review them before saving. Voice dictation uses microphone access and the OpenAI transcription endpoint; the API key stays server-side in Vercel environment variables.
- The paneer rolls recipe records the combined batch yield (2 rice-paper + 3 tortilla rolls). The meal builder currently counts the recipe as a batch unit; for precise roll-type tracking, add separate recipe entries for each roll type or adjust the batch data.
