# Gather — Recipe & Meal Planner

A mobile-first React + Vite recipe book and meal builder.

## Run locally
1. Install Node.js (18+).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.

## Features
- 11 seeded vegetarian recipes with ingredient lists, estimated nutrition, servings and cooking steps.
- Recipe search and category filters.
- Add, edit, duplicate and delete recipes.
- Ingredient quantities and per-batch nutrition can be edited when creating or updating a recipe.
- Meal builder with add/remove and portion count controls.
- Nutrition overview and per-serving recipe estimates.
- Local browser persistence plus JSON export/import backup.

## Notes
- Nutrition values are estimates, not laboratory values. Enter the values from your product labels for better accuracy.
- Some quantities in recipes where exact amounts were not available are starter estimates and should be checked against the way you cook.
- Data is stored in the current browser on the current device. Use Export backup / Import backup to move data between devices. A hosted cross-device version needs a database and deployment.
- The paneer rolls recipe records the combined batch yield (2 rice-paper + 3 tortilla rolls). The meal builder currently counts the recipe as a batch unit; for precise roll-type tracking, add separate recipe entries for each roll type or adjust the batch data.
