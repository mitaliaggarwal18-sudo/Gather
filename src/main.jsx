import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Home, BookOpen, Utensils, ChartNoAxesCombined, Plus, Search, ChevronRight, ArrowLeft, Trash2, Copy, Edit3, Check, X, Minus, Save, Download, Upload, Leaf, Clock3, Users, Flame, Beef, Wheat, Salad } from "lucide-react";
import "./style.css";

const seed = [
 {id:"dahi-rice",name:"Dahi rice with paneer tikka",category:"Lunch",servings:2,time:30,ingredients:[["Cooked white rice",200,"g",260,5.4,55.6],["Paneer",145,"g",435,27,5.1],["Dahi marinade",57,"g",55,3,4],["Besan",4,"g",15,0.9,2.2],["Hung curd / Greek yoghurt",190,"g",139,18,7],["Cucumber, tomato & onion",120,"g",30,1.5,5],["Olive oil",2,"ml",18,0,0],["Ghee",2.5,"ml",22,0,0],["Tadka spices & herbs",1,"serve",12,0.5,1.5]],steps:["Marinate paneer with dahi, besan and spices. Rest for 10–15 minutes.","Pan-sear or air-fry the paneer until lightly charred.","Mix hung curd with chopped cucumber, tomato, onion, coriander and garlic.","Prepare a small tadka with ghee, mustard seeds, urad dal, chilli and hing.","Serve rice with the curd salad and paneer tikka; finish with tadka."]},
 {id:"burrito",name:"Paneer burrito bowl",category:"Lunch",servings:2,time:25,ingredients:[["Cooked white rice",200,"g",260,5.4,55.6],["Paneer",108,"g",324,20.2,3.8],["Cooked rajma",70,"g",89,6.1,11.5],["Greek yoghurt",160,"g",117,16,6],["Dahi marinade",35,"g",34,1.8,2.5],["Besan",4,"g",15,0.9,2.2],["Avocado flesh",150,"g",240,3,2.7],["Tomato, onion & peppers",160,"g",45,2,8],["Olive oil",2,"ml",18,0,0]],steps:["Season paneer with dahi marinade and besan; cook until golden.","Warm the rajma with cumin, chilli and a splash of water.","Chop the vegetables and mash or dice the avocado.","Build bowls with rice, rajma, paneer, vegetables and yoghurt dressing.","Finish with lime, coriander and seasoning."]},
 {id:"rolls",name:"Paneer rolls (rice paper or tortilla)",category:"Lunch",servings:2,time:30,ingredients:[["Paneer for filling",196,"g",588,36.7,6.9],["Dahi marinade",35,"g",34,1.8,2.5],["Curd dressing",50,"g",31,2.5,2],["Besan",4,"g",15,0.9,2.2],["Onion & bell peppers",100,"g",30,1,6],["Olive oil",2,"ml",18,0,0],["Rice paper sheets",2,"pcs",70,1.2,15],["Tortilla wraps",3,"pcs",498,10.2,79.8]],steps:["Marinate the paneer with dahi, besan and spices; cook until browned.","Prepare a quick dressing with curd, herbs and seasoning.","Cook onion and bell peppers until just softened; combine with paneer.","For rice-paper rolls, soften one sheet at a time in warm water, add filling and fold.","For tortilla rolls, warm the wrap, add filling and dressing, then roll tightly.","The filling is shared across the batch: 2 rice-paper rolls plus 3 tortilla rolls. Select the wrap type and count when adding to a meal."]},
 {id:"paneer-sandwich",name:"Paneer tikka sandwich",category:"Breakfast",servings:1,time:20,ingredients:[["Bread",75,"g",221,7,37],["Paneer",80,"g",240,15,2.8],["Dahi marinade",58,"g",56,3,4],["Cheese",10,"g",36,2.5,0.3],["Onion & capsicum",60,"g",18,0.7,3.5],["Oil",2,"ml",18,0,0]],steps:["Mix paneer with dahi marinade and spices; rest for 10 minutes.","Sear paneer with onion and capsicum until lightly charred.","Layer the filling on bread, add cheese and toast until crisp.","Serve hot."]},
 {id:"dahi-sandwich",name:"Dahi & vegetable sandwich",category:"Breakfast",servings:1,time:15,ingredients:[["Bread",80,"g",260,8,44],["Curd",86,"g",53,3.7,4.1],["Capsicum, onion, carrot & cucumber",100,"g",35,1.2,7],["Seasoning & herbs",1,"serve",5,0.2,1]],steps:["Hang or strain curd briefly if it is runny.","Finely chop the vegetables and mix with curd, salt, pepper and herbs.","Spread generously over bread and toast in a pan or sandwich press."]},
 {id:"pasta",name:"Vegetable paneer pasta",category:"Dinner",servings:2,time:30,ingredients:[["Dry fusilli pasta",120,"g",431,15,84],["Paneer",80,"g",240,15,2.8],["Mozzarella",20,"g",60,4.5,0.5],["Cashews",12,"pcs",105,3.5,5],["Tomatoes",4,"medium",88,4.4,13],["Onion",1,"medium",44,1.2,9],["Capsicum",1,"medium",24,1,4.5],["Button mushrooms",5,"pcs",18,2.2,1.5],["Cherry tomatoes",8,"pcs",24,1.2,4],["Olive oil",5,"ml",40,0,0]],steps:["Boil pasta in salted water until al dente; reserve some pasta water.","Blend tomatoes, cashews and seasoning into a smooth sauce.","Sauté onion, capsicum and mushrooms in olive oil.","Add the sauce and simmer for 6–8 minutes; loosen with pasta water.","Fold in pasta, paneer and mozzarella. Adjust seasoning and serve."]},
 {id:"soya-kabab",name:"Soya hara bhara kabab",category:"Snack",servings:2,time:35,ingredients:[["Dry soya beans",50,"g",173,25,15],["Green peas",80,"g",65,4.3,8],["Besan",25,"g",97,5.5,14],["Rice flour",15,"g",55,1,12],["Onion",40,"g",16,0.4,3.5],["Garlic",4,"cloves",18,0.8,4],["Mozzarella",30,"g",90,6.8,0.7],["Ghee / oil",2.5,"ml",22,0,0],["Coriander & chilli",1,"serve",8,0.5,1.5]],steps:["Soak and cook soya beans until tender; drain very well.","Blanch peas. Mash or pulse with soya, onion, garlic, coriander and chilli.","Mix in besan, rice flour, mozzarella and spices until the mixture holds together.","Shape into kababs and pan-sear with a little ghee or air-fry until golden.","Serve with mint chutney or curd dip."]},
 {id:"ciabatta",name:"Ciabatta & avocado sandwich",category:"Breakfast",servings:1,time:10,ingredients:[["Ciabatta",90,"g",163,4.7,34],["Avocado",75,"g",120,1.5,1.4],["Vegan Gouda",15,"g",40,0.5,0.3],["Sun-dried tomato pesto",12,"g",48,0.5,1.5],["Sun-dried tomatoes, tomato, olives & basil",50,"g",35,1,5],["Olive oil drizzle",3,"ml",27,0,0],["Balsamic vinegar",5,"ml",5,0,1]],steps:["Slice and lightly toast the ciabatta.","Mash avocado with salt, pepper and a little lemon.","Spread pesto on the bread; layer avocado, tomato, olives, sun-dried tomato and vegan cheese.","Finish with basil, balsamic and a light olive-oil drizzle."]},
 {id:"pancakes",name:"Fluffy protein pancakes",category:"Breakfast",servings:1,time:20,ingredients:[["Protein powder",30,"g",120,24,3],["All-purpose flour",75,"g",273,7.5,57],["Baking powder",4,"g",2,0,0.5],["Sugar",15,"g",60,0,15],["Egg",1,"large",72,6.3,0.4],["Greek yoghurt",70,"g",51,7,2.6],["Milk",32,"ml",20,1,1.5],["Vegetable oil",10,"g",90,0,0]],steps:["Whisk flour, protein powder, baking powder and sugar.","In another bowl, whisk egg, yoghurt and milk.","Fold wet ingredients into dry ingredients. Add a splash of milk if too thick.","Heat a lightly greased non-stick pan over medium-low heat.","Cook small pancakes until bubbles form, flip and cook through. The full batch is one serving."]},
 {id:"tikka",name:"Air-fryer paneer tikka",category:"Dinner",servings:1,time:25,ingredients:[["Paneer",200,"g",600,37.5,7,0,"","estimated",true],["Curd",60,"g",37,2.6,2.9,0,"","estimated",true],["Besan",10,"g",39,2.2,5.8,0,"","estimated",true],["Garlic",2,"cloves",9,0.4,2],["Oil",2,"ml",18,0,0],["Spices, lemon & chilli",1,"serve",10,0.5,2]],steps:["Cut paneer into even cubes.","Whisk curd, besan, garlic, lemon juice and spices into a thick marinade.","Coat paneer and rest for 15–20 minutes.","Arrange in a single layer in the air fryer; cook at 190°C for 8–10 minutes, turning once.","Serve with mint chutney and salad. Paneer, curd and besan quantities are starter estimates—edit to match your actual recipe."]},
 {id:"momos",name:"Rice-paper paneer momos",category:"Snack",servings:1,time:25,ingredients:[["Rice-paper sheets",3,"pcs",105,1.8,22.5],["Paneer",100,"g",300,18.8,3.5],["Cabbage",100,"g",25,1.3,3.3],["Garlic",2,"cloves",9,0.4,2],["Soy sauce",5,"ml",3,0.4,0.3],["Seasoning",1,"serve",3,0.1,0.5]],steps:["Crumble paneer and finely shred cabbage.","Sauté cabbage and garlic briefly; add paneer, soy sauce, pepper and salt.","Dip rice-paper sheets in warm water until pliable.","Place filling in each sheet and fold into a momo shape.","Steam gently for 4–5 minutes or air-fry lightly until the wrapper firms up. Three momos are one serving."]}
];

const money = n => Math.round(n);
const sum = (ings, idx) => ings.reduce((a,x)=>a+(Number(x[idx])||0),0);
function estimatedFiberPer100g(name="") {
 const n=name.toLowerCase();
 if (/rajma|kidney bean|chickpea|chana|lentil|dal|soya bean/.test(n)) return 7;
 if (/green peas/.test(n)) return 5.5;
 if (/besan/.test(n)) return 10;
 if (/oat/.test(n)) return 10;
 if (/whole.?wheat|atta/.test(n)) return 10;
 if (/avocado/.test(n)) return 6.7;
 if (/cabbage/.test(n)) return 2.5;
 if (/capsicum|bell pepper/.test(n)) return 2;
 if (/cucumber/.test(n)) return .5;
 if (/tomato/.test(n)) return 1.2;
 if (/onion/.test(n)) return 1.7;
 if (/mushroom/.test(n)) return 1;
 if (/carrot/.test(n)) return 2.8;
 if (/garlic/.test(n)) return 2;
 if (/cashew/.test(n)) return 3.3;
 if (/almond/.test(n)) return 12.5;
 if (/chia|flax/.test(n)) return 27;
 if (/paneer|cheese|mozzarella|curd|dahi|yoghurt|milk|egg|oil|ghee|butter|protein powder/.test(n)) return 0;
 if (/vegetable|herb|coriander|spinach|pepper|spices|seasoning/.test(n)) return 2;
 return 1.5;
}
function gramsForIngredient(x) {
 const q=Number(x[1])||0, u=String(x[2]||"").toLowerCase();
 if (u==="kg") return q*1000;
 if (["g","gram","grams","ml"].includes(u)) return q;
 if (["pcs","pc","piece","pieces"].includes(u)) return q*30;
 if (["clove","cloves"].includes(u)) return q*4;
 if (u==="medium") return q*100;
 if (u==="large") return q*150;
 if (u==="small") return q*50;
 if (["serve","serving"].includes(u)) return q*10;
 return q;
}
const isFiberEstimated = x => x[8] !== "verified" || x[9] === true;
const ingredientFiber = x => x[8] === "database" ? (Number(x[6])||0) : (isFiberEstimated(x) ? gramsForIngredient(x)*estimatedFiberPer100g(x[0])/100 : (Number(x[6])||0));
const nutrition = r => ({kcal:sum(r.ingredients,3), protein:sum(r.ingredients,4), carbs:sum(r.ingredients,5), fiber:r.ingredients.reduce((a,x)=>a+ingredientFiber(x),0)});
const hasEstimatedFiber = r => r.ingredients.some(isFiberEstimated);
const netCarbs = r => Math.max(0, nutrition(r).carbs - nutrition(r).fiber);
function recipeRating(r) {
 const n=nutrition(r), servings=Math.max(1,Number(r.servings)||1), kcal=n.kcal/servings, protein=n.protein/servings, fibre=n.fiber/servings;
 const proteinScore=Math.min(10, protein/3);
 const calorieScore=kcal<=250?10:kcal<=350?9:kcal<=450?8:kcal<=550?7:kcal<=650?6:kcal<=800?5:4;
 const fibreScore=Math.min(10, fibre/0.3);
 const names=r.ingredients.map(x=>String(x[0]||"").toLowerCase()).join(" ");
 const fatScore=/olive|avocado|nuts|seed/.test(names)?8:/ghee|butter|cream|coconut/.test(names)?5:7;
 const ingredientScore=/vegetable|tomato|onion|capsicum|cabbage|peas|rajma|avocado|spinach|mushroom/.test(names)?8:6;
 const score=Math.round((proteinScore*.30+calorieScore*.25+fibreScore*.20+fatScore*.15+ingredientScore*.10)*10)/10;
 return {score, label:score>=8.5?"Excellent":score>=7?"Good":score>=5?"Average":"Needs improvement", parts:[["Protein adequacy",proteinScore],["Calorie efficiency",calorieScore],["Fibre adequacy",fibreScore],["Fat quality",fatScore],["Ingredient quality",ingredientScore]]};
}
// Built-in reference nutrition database: approximate values per 100 g edible portion.
// Values are generic estimates, not brand-specific label data. Verify packaged foods against their labels.
const INGREDIENT_DB = [
 {id:"paneer",name:"Paneer",kcal:265,p:18.3,c:1.2,f:0.0},
 {id:"tofu",name:"Tofu",kcal:144,p:17.3,c:2.8,f:2.3},
 {id:"milk",name:"Whole milk",kcal:61,p:3.2,c:4.8,f:0},
 {id:"curd",name:"Plain curd",kcal:61,p:3.5,c:4.7,f:0},
 {id:"greek-yogurt",name:"Greek yoghurt, plain",kcal:97,p:9,c:3.9,f:0},
 {id:"cheese",name:"Cheddar cheese",kcal:403,p:24.9,c:1.3,f:0},
 {id:"mozzarella",name:"Mozzarella",kcal:280,p:28,c:3.1,f:0},
 {id:"egg",name:"Whole egg",kcal:143,p:12.6,c:0.7,f:0},
 {id:"egg-white",name:"Egg white",kcal:52,p:10.9,c:0.7,f:0},
 {id:"rice-white-dry",name:"White rice, uncooked",kcal:365,p:7.1,c:80,f:1.3},
 {id:"rice-white-cooked",name:"White rice, cooked",kcal:130,p:2.7,c:28.2,f:0.4},
 {id:"brown-rice-cooked",name:"Brown rice, cooked",kcal:123,p:2.7,c:25.6,f:1.6},
 {id:"atta",name:"Whole wheat atta",kcal:340,p:13.2,c:72,f:10.7},
 {id:"maida",name:"Maida / all-purpose flour",kcal:364,p:10.3,c:76.3,f:2.7},
 {id:"besan",name:"Besan",kcal:387,p:22.4,c:57.8,f:10.8},
 {id:"oats",name:"Rolled oats",kcal:389,p:16.9,c:66.3,f:10.6},
 {id:"pasta-dry",name:"Pasta, dry",kcal:371,p:13,c:74.7,f:3.2},
 {id:"rajma-cooked",name:"Rajma, cooked",kcal:127,p:8.7,c:22.8,f:6.4},
 {id:"chickpeas-cooked",name:"Chickpeas, cooked",kcal:164,p:8.9,c:27.4,f:7.6},
 {id:"moong-dal-cooked",name:"Moong dal, cooked",kcal:105,p:7,c:19.2,f:7.6},
 {id:"masoor-dal-cooked",name:"Masoor dal, cooked",kcal:116,p:9,c:20.1,f:7.9},
 {id:"soya-chunks-dry",name:"Soya chunks, dry",kcal:345,p:52,c:33,f:13},
 {id:"peas",name:"Green peas",kcal:81,p:5.4,c:14.5,f:5.1},
 {id:"potato",name:"Potato",kcal:77,p:2,c:17.5,f:2.2},
 {id:"sweet-potato",name:"Sweet potato",kcal:86,p:1.6,c:20.1,f:3},
 {id:"onion",name:"Onion",kcal:40,p:1.1,c:9.3,f:1.7},
 {id:"tomato",name:"Tomato",kcal:18,p:0.9,c:3.9,f:1.2},
 {id:"capsicum",name:"Capsicum",kcal:31,p:1,c:6,f:2.1},
 {id:"cucumber",name:"Cucumber",kcal:15,p:0.7,c:3.6,f:0.5},
 {id:"carrot",name:"Carrot",kcal:41,p:0.9,c:9.6,f:2.8},
 {id:"cabbage",name:"Cabbage",kcal:25,p:1.3,c:5.8,f:2.5},
 {id:"spinach",name:"Spinach",kcal:23,p:2.9,c:3.6,f:2.2},
 {id:"broccoli",name:"Broccoli",kcal:34,p:2.8,c:6.6,f:2.6},
 {id:"mushroom",name:"Button mushrooms",kcal:22,p:3.1,c:3.3,f:1},
 {id:"cauliflower",name:"Cauliflower",kcal:25,p:1.9,c:5,f:2},
 {id:"avocado",name:"Avocado",kcal:160,p:2,c:8.5,f:6.7},
 {id:"banana",name:"Banana",kcal:89,p:1.1,c:22.8,f:2.6},
 {id:"apple",name:"Apple",kcal:52,p:0.3,c:13.8,f:2.4},
 {id:"almonds",name:"Almonds",kcal:579,p:21.2,c:21.6,f:12.5},
 {id:"cashews",name:"Cashews",kcal:553,p:18.2,c:30.2,f:3.3},
 {id:"chia",name:"Chia seeds",kcal:486,p:16.5,c:42.1,f:34.4},
 {id:"flax",name:"Flax seeds",kcal:534,p:18.3,c:28.9,f:27.3},
 {id:"olive-oil",name:"Olive oil",kcal:884,p:0,c:0,f:0},
 {id:"ghee",name:"Ghee",kcal:900,p:0,c:0,f:0},
 {id:"sugar",name:"Sugar",kcal:387,p:0,c:100,f:0},
 {id:"honey",name:"Honey",kcal:304,p:0.3,c:82.4,f:0},
 {id:"bread-whole",name:"Whole wheat bread",kcal:247,p:13,c:41,f:7},
 {id:"bread-white",name:"White bread",kcal:266,p:8.9,c:49,f:2.7},
 {id:"coriander-leaves",name:"Fresh coriander leaves",kcal:23,p:2.1,c:3.7,f:2.8},
 {id:"coriander-seeds",name:"Coriander seeds",kcal:298,p:12.4,c:54.99,f:41.9},
 {id:"coriander-powder",name:"Coriander powder",kcal:298,p:12.4,c:54.99,f:41.9},
 {id:"mint",name:"Fresh mint leaves",kcal:44,p:3.3,c:8.4,f:6.8},
 {id:"curry-leaves",name:"Curry leaves",kcal:108,p:6.1,c:18.7,f:6.4},
 {id:"green-chilli",name:"Green chilli",kcal:40,p:2,c:9.5,f:1.5},
 {id:"red-chilli",name:"Red chilli powder",kcal:282,p:13.5,c:50,f:34.8},
 {id:"turmeric",name:"Turmeric powder",kcal:312,p:9.7,c:67.1,f:22.7},
 {id:"cumin-seeds",name:"Cumin seeds",kcal:375,p:17.8,c:44.2,f:10.5},
 {id:"mustard-seeds",name:"Mustard seeds",kcal:508,p:26.1,c:28.1,f:12.2},
 {id:"ajwain",name:"Ajwain seeds",kcal:305,p:16,c:43,f:21},
 {id:"garam-masala",name:"Garam masala",kcal:379,p:15,c:46,f:14},
 {id:"hing",name:"Asafoetida (hing)",kcal:297,p:4,c:68,f:4},
 {id:"kasuri-methi",name:"Kasuri methi",kcal:323,p:23,c:58,f:25},
 {id:"ginger",name:"Fresh ginger",kcal:80,p:1.8,c:17.8,f:2},
 {id:"garlic",name:"Garlic",kcal:149,p:6.4,c:33.1,f:2.1},
 {id:"lemon",name:"Lemon juice",kcal:22,p:0.4,c:6.9,f:0.3},
 {id:"lemon-whole",name:"Lemon",kcal:29,p:1.1,c:9.3,f:2.8},
 {id:"beetroot",name:"Beetroot",kcal:43,p:1.6,c:9.6,f:2.8},
 {id:"brinjal",name:"Brinjal / eggplant",kcal:25,p:1,c:5.9,f:3},
 {id:"okra",name:"Bhindi / okra",kcal:33,p:1.9,c:7.5,f:3.2},
 {id:"lauki",name:"Bottle gourd (lauki)",kcal:14,p:0.6,c:3.4,f:0.5},
 {id:"pumpkin",name:"Pumpkin",kcal:26,p:1,c:6.5,f:0.5},
 {id:"radish",name:"Radish",kcal:16,p:0.7,c:3.4,f:1.6},
 {id:"green-beans",name:"Green beans",kcal:31,p:1.8,c:7,f:3.4},
 {id:"corn",name:"Sweet corn",kcal:86,p:3.3,c:19,f:2.7},
 {id:"lettuce",name:"Lettuce",kcal:15,p:1.4,c:2.9,f:1.3},
 {id:"spring-onion",name:"Spring onion",kcal:32,p:1.8,c:7.3,f:2.6},
 {id:"zucchini",name:"Zucchini",kcal:17,p:1.2,c:3.1,f:1},
 {id:"mango",name:"Mango",kcal:60,p:0.8,c:15,f:1.6},
 {id:"orange",name:"Orange",kcal:47,p:0.9,c:11.8,f:2.4},
 {id:"strawberry",name:"Strawberries",kcal:32,p:0.7,c:7.7,f:2},
 {id:"dates",name:"Dates",kcal:282,p:2.5,c:75,f:8},
 {id:"raisins",name:"Raisins",kcal:299,p:3.1,c:79.2,f:3.7},
 {id:"walnuts",name:"Walnuts",kcal:654,p:15.2,c:13.7,f:6.7},
 {id:"peanuts",name:"Peanuts",kcal:567,p:25.8,c:16.1,f:8.5},
 {id:"pumpkin-seeds",name:"Pumpkin seeds",kcal:559,p:30.2,c:10.7,f:6},
 {id:"sunflower-seeds",name:"Sunflower seeds",kcal:584,p:20.8,c:20,f:8.6},
 {id:"sesame",name:"Sesame seeds",kcal:573,p:17.7,c:23.4,f:11.8},
 {id:"moong-dal-dry",name:"Moong dal, dry",kcal:347,p:23.9,c:62.6,f:16.3},
 {id:"masoor-dal-dry",name:"Masoor dal, dry",kcal:352,p:24.6,c:63.1,f:10.7},
 {id:"toor-dal-dry",name:"Toor dal, dry",kcal:343,p:22.3,c:62.8,f:15},
 {id:"chana-dal-dry",name:"Chana dal, dry",kcal:360,p:20.8,c:60.7,f:12.6},
 {id:"urad-dal-dry",name:"Urad dal, dry",kcal:341,p:25.2,c:58.9,f:18.3},
 {id:"quinoa",name:"Quinoa, cooked",kcal:120,p:4.4,c:21.3,f:2.8},
 {id:"poha",name:"Poha / flattened rice, dry",kcal:350,p:6.7,c:77,f:1.9},
 {id:"suji",name:"Suji / semolina",kcal:360,p:12.7,c:72.8,f:3.9},
 {id:"ragi",name:"Ragi flour",kcal:336,p:7.3,c:72,f:11.5},
 {id:"jowar",name:"Jowar flour",kcal:349,p:10.4,c:72.6,f:6.7},
 {id:"bajra",name:"Bajra flour",kcal:361,p:11.6,c:67.5,f:11.3},
 {id:"coconut",name:"Fresh coconut",kcal:354,p:3.3,c:15.2,f:9},
 {id:"coconut-milk",name:"Coconut milk",kcal:230,p:2.3,c:5.5,f:2.2},
 {id:"tomato-puree",name:"Tomato puree",kcal:38,p:1.7,c:8.2,f:1.5},
 {id:"soy-sauce",name:"Soy sauce",kcal:53,p:8.1,c:4.9,f:0.8},
 {id:"vinegar",name:"Vinegar",kcal:18,p:0,c:0.04,f:0},
 {id:"mayonnaise",name:"Mayonnaise",kcal:680,p:1,c:0.6,f:0},
 {id:"peanut-butter",name:"Peanut butter",kcal:588,p:25,c:20,f:6},
 {id:"jaggery",name:"Jaggery",kcal:383,p:0.4,c:98,f:0}
];
function ingredientWeightGrams(qty, unit, ingredientName="") {
 const q=Number(qty)||0, u=String(unit||"g").toLowerCase().trim(), name=ingredientName.toLowerCase();
 if (["kg"].includes(u)) return q*1000;
 if (["g","gram","grams"].includes(u)) return q;
 if (["ml","millilitre","milliliter"].includes(u)) return q; // approximate density of 1 g/ml
 if (["tsp","teaspoon"].includes(u)) return q*5;
 if (["tbsp","tablespoon"].includes(u)) return q*15;
 if (["cup","cups"].includes(u)) return q*150;
 if (["clove","cloves"].includes(u)) return q*4;
 if (["pcs","pc","piece","pieces"].includes(u)) {
   const weights=[[/egg/,50],[/onion/,110],[/tomato/,120],[/potato/,150],[/lemon/,60],[/lime/,45],[/banana/,118],[/apple/,180],[/orange/,130],[/avocado/,150],[/capsicum|bell pepper/,120],[/green chilli|red chilli/,8],[/garlic/,3],[/ginger/,5],[/cucumber/,250],[/carrot/,60],[/bread/,30],[/roti|chapati/,40],[/coriander leaves/,30]];
   const found=weights.find(([re])=>re.test(name));
   return q*(found?found[1]:30);
 }
 if (u==="medium") return q*100;
 if (u==="large") return q*150;
 if (u==="small") return q*50;
 return q;
}
function dbNutritionForQuantity(entry, qty, unit) {
 const grams=ingredientWeightGrams(qty,unit,entry.name), factor=grams/100;
 return [entry.kcal*factor,entry.p*factor,entry.c*factor,entry.f*factor].map(v=>Math.round(v*100)/100);
}
const clone = x => JSON.parse(JSON.stringify(x));
function getVideoEmbedUrl(url="") { try { const u=new URL(url); const host=u.hostname.replace("www.",""); if(host==="youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`; if(host.includes("youtube.com")){const id=u.searchParams.get("v")||u.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1];return id?`https://www.youtube.com/embed/${id}`:null;} if(host.includes("vimeo.com")){const id=u.pathname.split("/").filter(Boolean).pop();return id?`https://player.vimeo.com/video/${id}`:null;} return null;}catch{return null;} }
function App(){
 const [recipes,setRecipes]=useState(()=>{try{return JSON.parse(localStorage.getItem("gather-recipes"))||seed}catch{return seed}});
 const [page,setPage]=useState("Home"),[selected,setSelected]=useState(null),[query,setQuery]=useState(""),[category,setCategory]=useState("All");
 const [meal,setMeal]=useState([]),[mealName,setMealName]=useState("Today's meal"),[showForm,setShowForm]=useState(false),[editing,setEditing]=useState(null);
 const [form,setForm]=useState(null),[toast,setToast]=useState(""),[builderOpen,setBuilderOpen]=useState(false),[recipePaneOpen,setRecipePaneOpen]=useState(true),[cookMode,setCookMode]=useState(false);
 const [expandedPerson,setExpandedPerson]=useState(null),[showOutsideFood,setShowOutsideFood]=useState(false),[outsideFoods,setOutsideFoods]=useState([]);
 const [pendingFoodMember,setPendingFoodMember]=useState("Mitali"),[foodQuery,setFoodQuery]=useState(""),[foodResults,setFoodResults]=useState([]),[foodLoading,setFoodLoading]=useState(false),[foodError,setFoodError]=useState(""),[selectedFood,setSelectedFood]=useState(null),[foodQuantity,setFoodQuantity]=useState("1");
 useEffect(()=>localStorage.setItem("gather-recipes",JSON.stringify(recipes)),[recipes]);
 const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
 const openRecipe=r=>{setSelected(r.id);setPage("Recipes")};
 const current=recipes.find(r=>r.id===selected);
 const filtered=recipes.filter(r=>(category==="All"||r.category===category)&&r.name.toLowerCase().includes(query.toLowerCase()));
 const mealRows=meal.map(x=>({...x,member:x.member||"Mitali",recipe:recipes.find(r=>r.id===x.id)})).filter(x=>x.recipe);
 const totalsFor=person=>{
   const rows=mealRows.filter(x=>x.member===person), foods=outsideFoods.filter(x=>x.member===person);
   const t={kcal:0,protein:0,carbs:0,fiber:0};
   rows.forEach(x=>{const n=nutrition(x.recipe),f=x.count/(x.recipe.id==="rolls"?5:x.recipe.servings);t.kcal+=n.kcal*f;t.protein+=n.protein*f;t.carbs+=netCarbs(x.recipe)*f;t.fiber+=n.fiber*f;});
   foods.forEach(x=>{t.kcal+=x.kcal*x.count;t.protein+=x.protein*x.count;t.carbs+=x.carbs*x.count;t.fiber+=x.fiber*x.count;});
   return t;
 };
 const mealTotals=totalsFor("Mitali"), abhinavTotals=totalsFor("Abhinav");
 const totalDishes=mealRows.reduce((a,x)=>a+x.count,0)+outsideFoods.reduce((a,x)=>a+x.count,0);
 function addMeal(r,member="Mitali"){setMeal(old=>{const found=old.find(x=>x.id===r.id&&(x.member||"Mitali")===member);return found?old.map(x=>x.id===r.id&&(x.member||"Mitali")===member?{...x,count:x.count+1}:x):[...old,{id:r.id,count:1,member}]});setExpandedPerson(member);notify("Added to "+member+"'s meal");}
 function removeMeal(id,member="Mitali"){setMeal(old=>old.filter(x=>!(x.id===id&&(x.member||"Mitali")===member)))}
 async function searchOutsideFood(){
   const q=foodQuery.trim();if(!q)return;
   setFoodLoading(true);setFoodError("");setFoodResults([]);setSelectedFood(null);
   try{
     // Brand names are often indexed separately from product types in Open Food Facts.
     // Try the entered phrase first, then a small set of useful brand/product variants.
     const lower=q.toLowerCase();
     const queries=[q];
     if(lower.includes("wholetruth")||lower.includes("whole truth")){
       queries.push("The Whole Truth", "Whole Truth protein bar");
     }else{
       const compact=q.replace(/\\s+/g," ").trim();
       if(compact.split(" ").length>2)queries.push(compact.split(" ").slice(0,2).join(" "));
     }
     const uniqueQueries=[...new Set(queries.map(x=>x.trim()).filter(Boolean))];
     const found=new Map();
     for(const term of uniqueQueries){
       const url="https://world.openfoodfacts.org/cgi/search.pl?"+new URLSearchParams({search_terms:term,search_simple:"1",action:"process",json:"1",page_size:"20",fields:"code,product_name,brands,quantity,serving_size,serving_quantity,ingredients_text,nutriments,image_front_small_url,url"});
       const res=await fetch(url,{headers:{"Accept":"application/json"}});
       if(!res.ok)throw new Error("Food database is temporarily unavailable.");
       const data=await res.json();
       (data.products||[]).forEach(p=>{const key=p.code||p.product_name;if(key&&!found.has(key))found.set(key,p)});
       if(found.size>=8)break;
     }
     const items=[...found.values()].map(p=>{
       const n=p.nutriments||{}, per100={kcal:Number(n["energy-kcal_100g"]??(Number(n["energy_100g"]||0)/4.184))||0,protein:Number(n.proteins_100g)||0,carbs:Number(n.carbohydrates_100g)||0,fiber:Number(n.fiber_100g)||0};
       const has=per100.kcal>0||per100.protein>0||per100.carbs>0;
       const servingG=Number(p.serving_quantity)||0;
       return {id:p.code||p.product_name,name:p.product_name||p.brands||"Unnamed food",brand:p.brands||"",quantity:p.quantity||"",servingSize:p.serving_size||"",servingG,ingredients:p.ingredients_text||"",per100,has,image:p.image_front_small_url||"",source:"Open Food Facts",url:p.url||""};
     }).filter(x=>x.name&&x.has);
     setFoodResults(items);
     if(!items.length)setFoodError("No matching item with usable nutrition was found. Try “The Whole Truth” or scan the product barcode. Some products may not yet have nutrition data in Open Food Facts.");
   }catch(e){setFoodError(e.message||"Could not search food database.");}
   finally{setFoodLoading(false);}
 }
 function addSelectedFood(){
   if(!selectedFood)return;
   const qty=Math.max(.01,Number(foodQuantity)||1), baseG=selectedFood.servingG>0?selectedFood.servingG:100, factor=baseG/100*qty;
   const p=selectedFood.per100;
   setOutsideFoods(old=>[...old,{id:"food"+Date.now(),name:selectedFood.name+(selectedFood.brand?" · "+selectedFood.brand:""),unit:selectedFood.servingG>0?(selectedFood.servingSize||selectedFood.quantity||"serving"):"100 g",kcal:p.kcal*baseG/100,protein:p.protein*baseG/100,carbs:p.carbs*baseG/100,fiber:p.fiber*baseG/100,count:qty,member:pendingFoodMember,ingredients:selectedFood.ingredients,source:selectedFood.source,sourceUrl:selectedFood.url,baseQuantity:qty}]);
   setShowOutsideFood(false);setExpandedPerson(pendingFoodMember);setFoodQuery("");setFoodResults([]);setSelectedFood(null);setFoodQuantity("1");notify("Added to "+pendingFoodMember+"'s meal");
 }
 function startNew(){setEditing(null);setForm({id:"r"+Date.now(),name:"",category:"Dinner",servings:1,time:20,videoUrl:"",ingredients:[["",0,"g",0,0,0,0]],steps:[""],stepImages:[""]});setShowForm(true)}
 function startEdit(r){setEditing(r.id);setForm(clone(r));setShowForm(true)}
 function saveRecipe(){if(!form.name.trim()){notify("Please add a recipe name");return}const clean={...form,ingredients:form.ingredients.filter(x=>x[0].trim()),steps:form.steps.filter(x=>x.trim())};setRecipes(old=>editing?old.map(r=>r.id===editing?clean:r):[clean,...old]);setSelected(clean.id);setShowForm(false);setPage("Recipes");notify(editing?"Recipe updated":"Recipe saved")}
 function applyIngredientDatabase(i, dbId) {
   const entry=INGREDIENT_DB.find(item=>item.id===dbId);
   if(!entry) return;
   setForm(f=>({...f,ingredients:f.ingredients.map((x,k)=>{
     if(k!==i) return x;
     const next=[...x];
     next[0]=entry.name;
     next[10]=entry.id;
     next[8]="database";
     next[9]=false;
     const vals=dbNutritionForQuantity(entry,next[1],next[2]);
     next[3]=vals[0]; next[4]=vals[1]; next[5]=vals[2]; next[6]=vals[3];
     return next;
   })}));
 }
 function updateIngredient(i,j,v){
   setForm(f=>({...f,ingredients:f.ingredients.map((x,k)=>{
     if(k!==i) return x;
     const next=[...x];
     if(j===1 || j===2){
       next[j]=j===1?(Number(v)||0):v;
       const entry=INGREDIENT_DB.find(item=>item.id===next[10]);
       if(entry){
         const vals=dbNutritionForQuantity(entry,next[1],next[2]);
         next[3]=vals[0]; next[4]=vals[1]; next[5]=vals[2]; next[6]=vals[3];
       } else if(j===1){
         const oldQty=Number(x[1])||0, newQty=Number(v)||0, ratio=oldQty>0?newQty/oldQty:0;
         [3,4,5,6].forEach(col=>{next[col]=Math.round(((Number(x[col])||0)*ratio)*100)/100;});
       }
     } else if(j===0) {
       next[0]=v;
       const match=INGREDIENT_DB.find(item=>item.name.toLowerCase()===String(v).trim().toLowerCase());
       if(match){next[10]=match.id;next[8]="database";const vals=dbNutritionForQuantity(match,next[1],next[2]);next[3]=vals[0];next[4]=vals[1];next[5]=vals[2];next[6]=vals[3];}
       else {next[10]="";}
     } else {
       next[j]=Number(v)||0;
       if(j===6){next[8]="verified";next[9]=false;next[10]="";}
       else if(j>=3 && j<=5){next[8]="custom";next[10]="";}
     }
     return next;
   })}));
 }

 function exportData(){const blob=new Blob([JSON.stringify({recipes,meal},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="gather-recipe-backup.json";a.click();URL.revokeObjectURL(a.href)}
 function importData(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const d=JSON.parse(reader.result);if(d.recipes){setRecipes(d.recipes);setMeal(d.meal||[]);notify("Backup restored")}else notify("That file is not a Gather backup")}catch{notify("Could not read backup")}};reader.readAsText(file)}
 const nav=[["Home",Home],["Recipes",BookOpen],["Nutrition",ChartNoAxesCombined]];
 return <div className="app">
  <aside className="sidebar"><div className="brand"><div className="brandmark"><Leaf size={20}/></div><div><b>gather</b><small>eat well, simply</small></div></div><div className="navlabel">YOUR KITCHEN</div>{nav.map(([n,I])=><button key={n} className={"nav "+(page===n?"active":"")} onClick={()=>{setPage(n);setSelected(null)}}><I size={18}/>{n}{n==="Meal Builder"&&meal.length>0&&<span className="navcount">{meal.length}</span>}</button>)}<div className="sidebottom"><div className="leafcard"><Salad size={20}/><b>A little better, every day.</b><span>Small choices add up to feel-good meals.</span></div><button className="textbtn" onClick={exportData}><Download size={15}/> Export backup</button><label className="textbtn upload"><Upload size={15}/> Import backup<input type="file" accept="application/json" onChange={importData}/></label></div></aside>
  <main className="main"><header className="topbar"><div className="mobilebrand"><Leaf size={18}/> gather</div><span className="eyebrow">YOUR PERSONAL RECIPE SPACE</span><div className="topright"><span className="today">Made for real-life cooking</span><button className="avatar">G</button></div></header>
  {page==="Home"&&<section className="content home-recipes"><div className="home-recipe-heading"><div><span className="eyebrow green">YOUR COLLECTION</span><h1>In your recipe book</h1><p>{recipes.length} recipes saved · Find something good to make.</p></div><button className="primary" onClick={startNew}><Plus size={17}/> Add recipe</button></div><div className="toolbar home-toolbar"><div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a recipe..."/></div><div className="toolbar-actions"><button className="softbtn" onClick={()=>{setPage("Recipes");setBuilderOpen(true);setSelected(null)}}><Utensils size={15}/> Build a meal</button></div></div><div className="filters">{["All","Breakfast","Lunch","Dinner","Snack"].map(cat=><button className={category===cat?"filter activefilter":"filter"} key={cat} onClick={()=>setCategory(cat)}>{cat}</button>)}</div><div className="recipegrid">{filtered.map((r,i)=><RecipeCard key={r.id} r={r} onOpen={()=>openRecipe(r)} onAddMitali={()=>addMeal(r,"Mitali")} onAddAbhinav={()=>addMeal(r,"Abhinav")} index={i}/>)}</div>{filtered.length===0&&<div className="empty">No recipes found. Try another search or add a new one.</div>}</section>}  {page==="Recipes"&&<section className="content">{current?<div className={"recipe-workspace "+(!recipePaneOpen?"pane-collapsed ":"")+(builderOpen?"with-builder":"")}><aside className="recipe-rail"><button className="rail-toggle" onClick={()=>setRecipePaneOpen(!recipePaneOpen)} title="Collapse recipes"><BookOpen size={16}/>{recipePaneOpen&&<span>Recipes</span>}<ChevronRight size={15}/></button>{recipePaneOpen&&<><div className="rail-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a recipe"/></div><div className="rail-list">{filtered.map(r=><button key={r.id} className={"rail-recipe "+(r.id===current.id?"selected":"")} onClick={()=>setSelected(r.id)}><b>{r.name}</b><small>{r.category} · {Math.round(nutrition(r).kcal/r.servings)} kcal/serving</small></button>)}</div></>}</aside><div className="recipe-main"><div className="workspace-toolbar"><button className="back" onClick={()=>setSelected(null)}><ArrowLeft size={16}/> All recipes</button><button className="softbtn builder-toggle" onClick={()=>setBuilderOpen(!builderOpen)}><Utensils size={15}/>{builderOpen?"Hide meal builder":"Open meal builder"}{meal.length>0&&<span className="navcount">{meal.length}</span>}</button></div><div className="detailhero"><div><span className="eyebrow green">{current.category.toUpperCase()} · {current.time} MIN</span><h1>{current.name}</h1><p>A practical, flexible recipe with editable quantities and nutrition estimates.</p><div className="detailactions"><button className="primary" onClick={()=>addMeal(current,"Mitali")}>Add to Mitali <Plus size={16}/></button><button className="softbtn" onClick={()=>addMeal(current,"Abhinav")}>Add to Abhinav <Plus size={16}/></button><button className="softbtn" onClick={()=>setCookMode(true)}><BookOpen size={16}/> Visual cook mode</button><button className="softbtn" onClick={()=>startEdit(current)}><Edit3 size={16}/> Edit recipe</button><button className="iconbtn" title="Duplicate" onClick={()=>{const c=clone(current);c.id="r"+Date.now();c.name+=" (copy)";setRecipes([c,...recipes]);notify("Recipe duplicated")}}><Copy size={16}/></button><button className="iconbtn danger" title="Delete" onClick={()=>{if(confirm("Delete this recipe?")){setRecipes(recipes.filter(r=>r.id!==current.id));setSelected(null);notify("Recipe deleted")}}}><Trash2 size={16}/></button></div></div><div className="detailphoto"><span>🥗</span></div></div>{current.videoUrl&&<div className="recipe-video panel"><span className="eyebrow">WATCH & LEARN</span><h2>Recipe video</h2>{getVideoEmbedUrl(current.videoUrl)?<div className="video-frame"><iframe src={getVideoEmbedUrl(current.videoUrl)} title={`${current.name} recipe video`} allowFullScreen/></div>:<a href={current.videoUrl} target="_blank" rel="noreferrer">Open recipe video</a>}</div>}<div className="recipe-rating panel"><div className="rating-heading"><div><span className="eyebrow">GATHER RECIPE RATING</span><h2>{recipeRating(current).score}/10 · {recipeRating(current).label}</h2></div><span className="rating-note">Heuristic estimate</span></div><div className="rating-grid">{recipeRating(current).parts.map(([label,value])=><div key={label}><span>{label}</span><b>{value.toFixed(1)}/10</b></div>)}</div><p className="hint">Ratings are indicative, not clinically validated. Fat and ingredient quality are inferred from ingredient names.</p></div><div className="macrostrip">{macro("Calories",nutrition(current).kcal/current.servings,"kcal",Flame)}{macro("Protein",nutrition(current).protein/current.servings,"g",Beef)}{macro("Net carbs",netCarbs(current)/current.servings,"g",Wheat)}<div className="macroitem"><Users/><div><b>{current.servings}</b><small>servings / batch</small></div></div></div><div className="recipebody"><div className="ingredients panel"><div className="panelhead"><div><span className="eyebrow">WHAT YOU'LL NEED</span><h2>Ingredients</h2></div><span className="muted">Full batch</span></div><div className="ingredient-table-wrap"><table className="ingredient-table"><thead><tr><th>Ingredient</th><th>Qty</th><th>Calories</th><th>Protein</th><th>Fibre</th><th>Net carbs</th></tr></thead><tbody>{current.ingredients.map((x,i)=><tr key={i}><td>{x[0]}</td><td>{x[1]} {x[2]}</td><td>{money(x[3])} kcal</td><td>{Number(x[4]).toFixed(1)}g</td><td>{ingredientFiber(x).toFixed(1)}g {isFiberEstimated(x)&&<span className="estimated-tag">Estimated</span>}</td><td>{Math.max(0,(Number(x[5])||0)-ingredientFiber(x)).toFixed(1)}g</td></tr>)}</tbody><tfoot><tr><th>Full batch</th><th>—</th><th>{money(nutrition(current).kcal)} kcal</th><th>{nutrition(current).protein.toFixed(1)}g</th><th>{nutrition(current).fiber.toFixed(1)}g {hasEstimatedFiber(current)&&<span className="estimated-tag">Estimated</span>}</th><th>{netCarbs(current).toFixed(1)}g</th></tr></tfoot></table></div></div><div className="steps panel"><span className="eyebrow">VISUAL COOKING GUIDE</span><h2>See each step</h2><p className="hint">Add a photo for each cooking step in Edit recipe. Visual Cook Mode shows one large step at a time.</p>{current.steps.map((s,i)=><div className="step" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{s}</p>{current.stepImages?.[i]&&<img className="step-thumb" src={current.stepImages[i]} alt={`Step ${i+1}`}/>}</div>)}<div className="servingnote"><Users size={17}/><span>Batch makes <b>{current.servings} {current.servings===1?"serving":"servings"}</b>. Nutrition above is shown per serving.</span></div></div></div></div>{builderOpen&&<aside className="inline-meal panel"><div className="panelhead"><div><span className="eyebrow">YOUR PLATE</span><h2>Meal builder</h2></div><button className="iconbtn" onClick={()=>setBuilderOpen(false)}><X size={15}/></button></div><input className="mealname" value={mealName} onChange={e=>setMealName(e.target.value)}/>{mealRows.length===0?<div className="emptymeal"><div>🍽️</div><b>Start building your meal</b><p>Choose a recipe, adjust its ingredients, then add it here.</p></div>:<>{mealRows.map(x=><div className="mealitem" key={x.id}><div><b>{x.recipe.name}</b><small>{Math.round(nutrition(x.recipe).kcal/x.recipe.servings)} kcal per serving</small></div><div className="stepper"><button onClick={()=>x.count>1?setMeal(m=>m.map(z=>z.id===x.id?{...z,count:z.count-1}:z)):removeMeal(x.id)}><Minus size={13}/></button><b>{x.count}</b><button onClick={()=>setMeal(m=>m.map(z=>z.id===x.id?{...z,count:z.count+1}:z))}><Plus size={13}/></button></div></div>)}<div className="totals"><span className="eyebrow">MEAL TOTAL</span><strong>{Math.round(mealTotals.kcal)} <small>kcal</small></strong><div className="totalmacros"><span><b>{mealTotals.protein.toFixed(1)}g</b> protein</span><span><b>{mealTotals.carbs.toFixed(1)}g</b> net carbs</span></div><button className="clearbtn" onClick={()=>setMeal([])}>Clear meal</button></div></>}</aside>}</div>:<><div className="pageintro"><span className="eyebrow green">THE RECIPE BOOK</span><h1>Good food, <em>on repeat.</em></h1><p>Keep your favourites close. Tweak quantities whenever you need.</p></div><div className="toolbar"><div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a recipe..."/></div><div className="toolbar-actions"><button className="softbtn" onClick={()=>{setBuilderOpen(true);if(!selected&&filtered.length)setSelected(filtered[0].id)}}><Utensils size={15}/> Open meal builder</button><button className="primary" onClick={startNew}><Plus size={17}/> Add new recipe</button></div></div><div className="filters">{["All","Breakfast","Lunch","Dinner","Snack"].map(c=><button className={category===c?"filter activefilter":"filter"} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="recipegrid">{filtered.map((r,i)=><RecipeCard key={r.id} r={r} onOpen={()=>setSelected(r.id)} onAddMitali={()=>addMeal(r,"Mitali")} onAddAbhinav={()=>addMeal(r,"Abhinav")} index={i}/>)}</div>{filtered.length===0&&<div className="empty">No recipes found. Try another search or add a new one.</div>}</>}</section>}
  {page==="Meal Builder"&&<section className="content"><div className="pageintro"><span className="eyebrow green">PUT IT TOGETHER</span><h1>Build your <em>meal.</em></h1><p>Choose dishes and portions. Your nutrition totals update as you go.</p></div><div className="meal-layout"><div className="mealchoose panel"><div className="panelhead"><div><span className="eyebrow">PICK FROM YOUR RECIPES</span><h2>Choose dishes</h2></div><span className="muted">{meal.length} selected</span></div>{recipes.map(r=><div className="choose-row" key={r.id}><div className="choose-thumb">🥘</div><div className="choose-info"><b>{r.name}</b><small>{r.category} · {Math.round(nutrition(r).kcal/r.servings)} kcal / serving</small></div><button className="addcircle" onClick={()=>addMeal(r)}><Plus size={17}/></button></div>)}<div className="outside-food-cta"><div><b>Something from outside the recipe book?</b><small>Add protein bars, packaged foods, Maggi, or homemade Indian dishes.</small></div><button className="softbtn" onClick={()=>{setPendingFoodMember("Mitali");setShowOutsideFood(true)}}><Plus size={15}/> Add food</button></div></div><div className="meal-summary panel"><span className="eyebrow">YOUR PLATE</span><input className="mealname" value={mealName} onChange={e=>setMealName(e.target.value)}/>{mealRows.length===0?<div className="emptymeal"><div>🍽️</div><b>Your meal starts here</b><p>Add a dish from the list to see your nutrition breakdown.</p></div>:<>{mealRows.map(x=><div className="mealitem" key={x.id}><div><b>{x.recipe.name}</b><small>{Math.round(nutrition(x.recipe).kcal/x.recipe.servings)} kcal per serving</small></div><div className="stepper"><button onClick={()=>x.count>1?setMeal(m=>m.map(z=>z.id===x.id?{...z,count:z.count-1}:z)):removeMeal(x.id)}><Minus size={13}/></button><b>{x.count}</b><button onClick={()=>setMeal(m=>m.map(z=>z.id===x.id?{...z,count:z.count+1}:z))}><Plus size={13}/></button></div></div>)}<div className="totals"><span className="eyebrow">MEAL TOTAL</span><strong>{Math.round(mealTotals.kcal)} <small>kcal</small></strong><div className="totalmacros"><span><b>{mealTotals.protein.toFixed(1)}g</b> protein</span><span><b>{mealTotals.carbs.toFixed(1)}g</b> net carbs</span></div><p>Net carbs = total carbohydrates minus dietary fibre. Add fibre values in each ingredient to improve accuracy.</p><button className="clearbtn" onClick={()=>setMeal([])}>Clear meal</button></div></>}</div></div></section>}
  {page==="Nutrition"&&<section className="content"><div className="pageintro"><span className="eyebrow green">THE BIG PICTURE</span><h1>Know what's <em>on your plate.</em></h1><p>Explore the estimated nutrition in your saved recipes, per serving.</p></div><div className="nutritioncards">{recipes.map(r=>{let n=nutrition(r);return <div className="nutritioncard" key={r.id} onClick={()=>{setSelected(r.id);setPage("Recipes")}}><div><b>{r.name}</b><small>{r.servings} {r.servings===1?"serving":"servings"} per batch</small></div><strong>{Math.round(n.kcal/r.servings)} <small>kcal</small></strong><div className="nutribottom"><span>{(n.protein/r.servings).toFixed(1)}g protein</span><span>{(netCarbs(r)/r.servings).toFixed(1)}g net carbs</span></div></div>})}</div><p className="fineprint">Nutrition is estimated from typical ingredient values and saved quantities. For best accuracy, replace estimates with the nutrition label on your exact products. Net carbs are calculated as total carbohydrates minus dietary fibre. Fibre values need to be entered for accurate results.</p></section>}
     </main>
  {cookMode&&current&&<div className="modalback cookback"><div className="cookmodal"><div className="cookhead"><div><span className="eyebrow green">GATHER · VISUAL COOK MODE</span><h2>{current.name}</h2></div><button className="iconbtn" onClick={()=>setCookMode(false)}><X/></button></div><div className="cookingredients"><b>Ingredients · {current.servings} {current.servings===1?"serving":"servings"}</b><div className="cookingredientgrid">{current.ingredients.map((x,i)=><div className="cookingredient" key={i}>{x[7]?<img className="cookingredient-photo" src={x[7]} alt={x[0]}/>:<div className="ingredient-symbol">{["🥬","🥣","🧅","🫑","🧄","🧂","🫒","🧀"][i%8]}</div>}<strong>{x[1]} {x[2]}</strong><small>{x[0]}</small></div>)}</div></div><div className="cooksteps">{current.steps.map((step,i)=><div className="cookstep" key={i}><div className="cookstep-number">{i+1}</div>{current.stepImages?.[i]?<img src={current.stepImages[i]} alt={`Cooking step ${i+1}`}/>:<div className="cook-placeholder"><span>{["🧺","🔪","🥣","🍳","🍽️"][i%5]}</span><small>Add a real photo for this step using Edit recipe</small></div>}<div className="cookstep-caption">{step}</div></div>)}</div><div className="cookfoot"><button className="primary" onClick={()=>{setCookMode(false);startEdit(current)}}><Edit3 size={15}/> Add / update step photos</button><button className="softbtn" onClick={()=>setCookMode(false)}>Close</button></div></div></div>}
  {showForm&&form&&<div className="modalback"><div className="modal"><div className="modalhead"><div><span className="eyebrow green">{editing?"UPDATE YOUR RECIPE":"ADD TO YOUR RECIPE BOOK"}</span><h2>{editing?"Edit recipe":"A new favourite"}</h2></div><button className="iconbtn" onClick={()=>setShowForm(false)}><X/></button></div><div className="formgrid"><label className="wide">Recipe name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Spinach and paneer bowl"/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Breakfast","Lunch","Dinner","Snack","Dessert"].map(x=><option>{x}</option>)}</select></label><label>Servings per batch<input type="number" min="1" value={form.servings} onChange={e=>setForm({...form,servings:Math.max(1,Number(e.target.value))})}/></label><label>Prep + cook time (min)<input type="number" min="1" value={form.time} onChange={e=>setForm({...form,time:Number(e.target.value)})}/></label></div><div className="formgrid"><label className="wide">Recipe video link (YouTube / Vimeo)<input type="url" value={form.videoUrl||""} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="Paste video URL"/></label></div><div className="formsection"><div className="formsectionhead"><h3>Ingredients & nutrition</h3><button className="linkbtn" onClick={()=>setForm({...form,ingredients:[...form.ingredients,["",0,"g",0,0,0,0,"","estimated",false,""]]})}><Plus size={15}/> Add ingredient</button></div><p className="hint">Enter nutrition for the full amount used in this batch. Changing quantity scales calories, protein, total carbs and fibre. Net carbs are calculated as total carbs minus fibre. Use the product label where available. Choose an ingredient from the built-in reference database to auto-fill nutrition per quantity. Values are generic estimates; use your package label for branded foods.</p><div className="ingredient-edit ingredient-edit-head"><span>Ingredient</span><span>Database match</span><span>Qty</span><span>Unit</span><span>kcal</span><span>Protein (g)</span><span>Carbs (g)</span><span>Fibre (g)</span><span>Photo</span><span></span></div>{form.ingredients.map((x,i)=><div className="ingredient-edit" key={i}><input className="ingname" placeholder="Ingredient name" value={x[0]} onChange={e=>updateIngredient(i,0,e.target.value)}/><select className="ingredient-db-select" aria-label="Choose standard ingredient" value={x[10]||""} onChange={e=>applyIngredientDatabase(i,e.target.value)}><option value="">Select ingredient…</option>{INGREDIENT_DB.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select><input aria-label="quantity" type="number" min="0" value={x[1]} onChange={e=>updateIngredient(i,1,e.target.value)}/><select className="ingredient-unit-select" aria-label="unit" value={x[2]||"g"} onChange={e=>updateIngredient(i,2,e.target.value)}>{["g","kg","ml","tsp","tbsp","cup","pieces","cloves","serving"].map(u=><option key={u} value={u}>{u}</option>)}</select><input aria-label="calories" type="number" placeholder="kcal" value={x[3]} onChange={e=>updateIngredient(i,3,e.target.value)}/><input aria-label="protein" type="number" placeholder="g" value={x[4]} onChange={e=>updateIngredient(i,4,e.target.value)}/><input aria-label="total carbs" type="number" placeholder="g" value={x[5]} onChange={e=>updateIngredient(i,5,e.target.value)}/><input aria-label="fibre" type="number" placeholder="g" value={x[6]??0} onChange={e=>updateIngredient(i,6,e.target.value)}/><label className="ingredient-photo-upload" title="Add ingredient photo">{x[7]?<img src={x[7]} alt="Ingredient"/>:<span>📷</span>}<input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const rows=form.ingredients.map((row,k)=>{if(k!==i)return row;const next=[...row];next[7]=reader.result;return next});setForm({...form,ingredients:rows})};reader.readAsDataURL(file)}}/></label><button className="removeing" onClick={()=>setForm({...form,ingredients:form.ingredients.filter((_,k)=>k!==i)})}><X size={15}/></button><span className="nutrition-source-tag">{x[8]==="verified"?"Label verified":x[8]==="database"?"Database estimate":"Manual / estimated"}</span></div>)}</div><div className="formsection"><div className="formsectionhead"><h3>Cooking instructions</h3><button className="linkbtn" onClick={()=>setForm({...form,steps:[...form.steps,""],stepImages:[...(form.stepImages||[]),""]})}><Plus size={15}/> Add step</button></div>{form.steps.map((s,i)=><div className="step-edit visual-step-edit" key={i}><span>{i+1}</span><div className="step-edit-fields"><textarea value={s} placeholder="Short step description (optional for cook)..." onChange={e=>setForm({...form,steps:form.steps.map((v,k)=>k===i?e.target.value:v)})}/><label className="photo-upload">{form.stepImages?.[i]?<img src={form.stepImages[i]} alt={`Step ${i+1} preview`}/>:<span>＋ Add step photo</span>}<input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const imgs=[...(form.stepImages||[])];imgs[i]=reader.result;setForm({...form,stepImages:imgs})};reader.readAsDataURL(file)}}/></label></div><button className="removeing" onClick={()=>setForm({...form,steps:form.steps.filter((_,k)=>k!==i),stepImages:(form.stepImages||[]).filter((_,k)=>k!==i)})}><X size={15}/></button></div>)}</div><div className="modalfoot"><button className="softbtn" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary" onClick={saveRecipe}><Save size={16}/> Save recipe</button></div></div></div>}
  <div className="dual-meal-cart">
   {["Mitali","Abhinav"].map(person=>{const rows=mealRows.filter(x=>x.member===person),foods=outsideFoods.filter(x=>x.member===person),t=totalsFor(person),open=expandedPerson===person;return <div className="dual-person" key={person}>
    {open&&<div className="dual-drawer"><div className="panelhead"><div><span className="eyebrow">TODAY'S MEAL</span><h2>{person}</h2></div><button className="iconbtn" onClick={()=>setExpandedPerson(null)}><X size={16}/></button></div>
     {!rows.length&&!foods.length&&<p className="hint">No foods added yet. Choose a recipe above or search for outside food.</p>}
     {rows.map(x=><div className="mealitem" key={person+x.id}><div><b>{x.recipe.name}</b><small>{Math.round(nutrition(x.recipe).kcal/x.recipe.servings)} kcal per serving</small></div><div className="stepper"><button onClick={()=>x.count>.25?setMeal(m=>m.map(z=>z.id===x.id&&(z.member||"Mitali")===person?{...z,count:Math.max(.25,Math.round((z.count-.25)*100)/100)}:z)):removeMeal(x.id,person)}><Minus size={13}/></button><input className="cart-qty" type="number" min=".25" step=".25" value={x.count} onChange={e=>setMeal(m=>m.map(z=>z.id===x.id&&(z.member||"Mitali")===person?{...z,count:Math.max(.01,Number(e.target.value)||.01)}:z))}/><button onClick={()=>setMeal(m=>m.map(z=>z.id===x.id&&(z.member||"Mitali")===person?{...z,count:Math.round((z.count+.25)*100)/100}:z))}><Plus size={13}/></button><button className="remove-food" onClick={()=>removeMeal(x.id,person)}><X size={13}/></button></div></div>)}
     {foods.map(x=><div className="mealitem" key={x.id}><div><b>{x.name}</b><small>{Math.round(x.kcal*x.count)} kcal · {x.unit} · {x.source}</small></div><div className="stepper"><button onClick={()=>setOutsideFoods(old=>old.map(z=>z.id===x.id?{...z,count:Math.max(.01,Math.round((z.count-.25)*100)/100)}:z))}><Minus size={13}/></button><input className="cart-qty" type="number" min=".01" step=".25" value={x.count} onChange={e=>setOutsideFoods(old=>old.map(z=>z.id===x.id?{...z,count:Math.max(.01,Number(e.target.value)||.01)}:z))}/><button onClick={()=>setOutsideFoods(old=>old.map(z=>z.id===x.id?{...z,count:Math.round((z.count+.25)*100)/100}:z))}><Plus size={13}/></button><button className="remove-food" onClick={()=>setOutsideFoods(old=>old.filter(z=>z.id!==x.id))}><X size={13}/></button></div></div>)}
     <button className="add-food-inline" onClick={()=>{setPendingFoodMember(person);setShowOutsideFood(true)}}><Plus size={14}/> Search outside food</button>
     <div className="cart-totals"><div><b>{Math.round(t.kcal)} kcal</b><small>Calories</small></div><div><b>{t.protein.toFixed(1)}g</b><small>Protein</small></div><div><b>{t.carbs.toFixed(1)}g</b><small>Carbs</small></div><div><b>{t.fiber.toFixed(1)}g</b><small>Fibre</small></div></div>
    </div>}
    <button className={"dual-ribbon "+(open?"active":"")} onClick={()=>setExpandedPerson(open?null:person)}><span><b>{person}'s meal</b><small>{rows.length+foods.length} items · {Math.round(t.kcal)} kcal · {t.protein.toFixed(1)}g protein</small></span><span>{open?"Close":"Open ↑"}</span></button>
   </div>})}
  </div>
  {showOutsideFood&&<div className="modalback food-search-back"><div className="modal food-search-modal"><div className="modalhead"><div><span className="eyebrow green">FOOD DATABASE SEARCH</span><h2>Add food to {pendingFoodMember}</h2><p className="hint">Search branded products and foods. Nutrition and ingredients come from the selected database record.</p></div><button className="iconbtn" onClick={()=>setShowOutsideFood(false)}><X/></button></div>
    <div className="food-search-row"><input value={foodQuery} onChange={e=>setFoodQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchOutsideFood()} placeholder="e.g. The Whole Truth protein bar, Maggi, Lay's"/><button className="primary" disabled={foodLoading||!foodQuery.trim()} onClick={searchOutsideFood}>{foodLoading?"Searching…":"Search"}</button></div>
    {foodError&&<p className="food-error">{foodError}</p>}
    {foodResults.map(item=><button className={"food-result "+(selectedFood?.id===item.id?"selected":"")} key={item.id} onClick={()=>{setSelectedFood(item);setFoodQuantity("1")}}>{item.image&&<img src={item.image} alt=""/>}<span><b>{item.name}</b><small>{item.brand} {item.quantity&&"· "+item.quantity} · {Math.round(item.per100.kcal)} kcal / 100g</small><small>{item.ingredients?item.ingredients.slice(0,180):"Ingredients not listed"} </small><small>Source: {item.source} · nutrition is community-contributed</small></span></button>)}
    {selectedFood&&<div className="selected-food-panel"><b>{selectedFood.name}</b><p>{selectedFood.ingredients||"Ingredient list unavailable in this database record."}</p><div className="food-macros"><span>{Math.round(selectedFood.per100.kcal)} kcal</span><span>{selectedFood.per100.protein.toFixed(1)}g protein</span><span>{selectedFood.per100.carbs.toFixed(1)}g carbs</span><span>{selectedFood.per100.fiber.toFixed(1)}g fibre</span><small>per 100 g · {selectedFood.servingSize||selectedFood.quantity||"serving size not supplied"}</small></div><label className="quantity-label">Quantity (fractions/decimals allowed)<input type="number" min=".01" step=".25" value={foodQuantity} onChange={e=>setFoodQuantity(e.target.value)}/></label><p className="hint">{selectedFood.servingG>0?"Quantity is counted in the listed serving size.":"Quantity is counted in 100 g units because no serving weight was supplied."} Nutrition scales proportionally.</p><button className="primary" onClick={addSelectedFood}>Add to {pendingFoodMember}'s meal</button></div>}
    <p className="hint">Source: Open Food Facts. Search is submitted manually rather than on every keystroke to respect its API rate limits. Missing nutrition records are not estimated or filled with invented values.</p>
   </div></div>}
  {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
 </div>
}
function macro(label,value,unit,Icon){return <div className="macroitem"><Icon/><div><b>{Math.round(value*10)/10} {unit}</b><small>{label} / serving</small></div></div>}
function RecipeCard({r,onOpen,onAddMitali,onAddAbhinav,index=0}){let n=nutrition(r),rating=recipeRating(r),emojis=["🥑","🥘","🌯","🥪","🥒","🍝","🧆","🥖","🥞","🍢","🥟"];return <div className="recipecard"><button className="card-open" onClick={onOpen}><div className={"cardphoto photo"+(index%5)}><span>{emojis[index%emojis.length]}</span><small>{r.category}</small></div><div className="cardbody"><h3>{r.name}</h3><div className="cardmeta"><span><Flame size={13}/>{Math.round(n.kcal/r.servings)} kcal</span><span><Beef size={13}/>{(n.protein/r.servings).toFixed(1)}g protein</span></div><div className="card-rating"><b>{rating.score.toFixed(1)}/10</b><span>{rating.label}</span></div><div className="cardfoot"><span>{r.servings} {r.servings===1?"serving":"servings"} / batch</span><ChevronRight size={16}/></div></div></button><div className="tile-add-pair"><button className="tile-add-person" onClick={onAddMitali} aria-label="Add to Mitali meal" title="Add to Mitali">M</button><button className="tile-add-person" onClick={onAddAbhinav} aria-label="Add to Abhinav meal" title="Add to Abhinav">A</button></div></div>}

createRoot(document.getElementById("root")).render(<App />);
