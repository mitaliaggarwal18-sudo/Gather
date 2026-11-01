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
 const baseFoods=[
 ["egg","Boiled egg","Protein","piece",78,6.3,.6,0,"Egg"],["paneer","Paneer","Protein","100 g",265,18.3,1.2,0,"Paneer"],["tofu","Tofu","Protein","100 g",144,17.3,2.8,2.3,"Tofu"],["curd","Plain curd","Dairy","100 g",61,3.5,4.7,0,"Milk / curd"],["greek","Greek yoghurt","Dairy","100 g",97,9,3.9,0,"Greek yoghurt"],["roti","Roti / chapati","Indian meals","piece",120,3.5,20,3,"Whole wheat atta"],["rice","Cooked rice","Indian meals","100 g",130,2.7,28.2,.4,"Rice"],["dal","Dal","Indian meals","bowl",165,10,27,7,"Dal, oil, spices"],["rajma","Rajma","Indian meals","bowl",190,12,31,8,"Rajma, onion, tomato"],["chole","Chole","Indian meals","bowl",220,11,32,8,"Chickpeas, onion, tomato"],["paneerbhurji","Paneer bhurji","Indian meals","bowl",280,17,10,2,"Paneer, onion, tomato"],["sabzi","Mixed veg sabzi","Indian meals","bowl",130,3,16,5,"Mixed vegetables, oil"],["aloo","Aloo sabzi","Indian meals","bowl",190,3,30,3,"Potato, oil"],["idli","Idli","Indian meals","piece",58,2,12,.5,"Idli batter"],["dosa","Plain dosa","Indian meals","piece",168,4,27,1.5,"Dosa batter, oil"],["poha","Poha","Indian meals","bowl",250,5,42,3,"Poha, peanuts, vegetables"],["upma","Vegetable upma","Indian meals","bowl",230,6,38,4,"Suji, vegetables"],["khichdi","Moong dal khichdi","Indian meals","bowl",220,9,38,4,"Rice, moong dal"],["chilla","Besan chilla","Indian meals","piece",150,7,18,4,"Besan, vegetables"],["momos","Veg momos","Indian meals","piece",45,1.5,7,1,"Momo wrapper, vegetable filling"],["maggi","Maggi prepared (1 pack)","Packaged","pack",310,7,44,2,"Instant noodles, seasoning"],["proteinbar","Protein bar (typical)","Packaged","bar",200,20,20,6,""],["makhana","Roasted makhana","Snacks","30 g bowl",105,3,22,1,"Makhana, ghee"],["banana","Banana","Fruit","piece",105,1.3,27,3.1,"Banana"],["apple","Apple","Fruit","piece",95,.5,25,4.4,"Apple"],["bread","Bread slice","Packaged","slice",75,2.5,13,1.5,"Bread"]];
 const [foods,setFoods]=useState(()=>{try{return JSON.parse(localStorage.getItem("gather-foods"))||[]}catch{return []}});
 const [logs,setLogs]=useState(()=>{try{return JSON.parse(localStorage.getItem("gather-meal-logs"))||[]}catch{return []}});
 const [page,setPage]=useState("Meals"),[member,setMember]=useState("Mitali"),[kind,setKind]=useState("Lunch"),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[mealName,setMealName]=useState(""),[items,setItems]=useState([]);
 const [search,setSearch]=useState(""),[category,setCategory]=useState("All"),[showFood,setShowFood]=useState(false),[period,setPeriod]=useState("Week"),[who,setWho]=useState("Both"),[pantryPeriod,setPantryPeriod]=useState("Week"),[pantryWho,setPantryWho]=useState("Both"),[toast,setToast]=useState("");
 const [form,setForm]=useState({name:"",category:"Packaged",unit:"serving",kcal:"",p:"",c:"",f:"",ingredients:""});
 useEffect(()=>{if(!foods.length)setFoods(baseFoods.map(a=>({id:a[0],name:a[1],category:a[2],unit:a[3],kcal:a[4],p:a[5],c:a[6],f:a[7],ingredients:a[8]})));},[]);
 useEffect(()=>localStorage.setItem("gather-foods",JSON.stringify(foods)),[foods]);useEffect(()=>localStorage.setItem("gather-meal-logs",JSON.stringify(logs)),[logs]);
 const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
 const visible=foods.filter(f=>(category==="All"||f.category===category)&&f.name.toLowerCase().includes(search.toLowerCase()));
 const add=f=>setItems(old=>{const x=old.find(z=>z.id===f.id);return x?old.map(z=>z.id===f.id?{...z,qty:z.qty+1}:z):[...old,{id:f.id,qty:1}]});
 const totals=items.reduce((a,x)=>{const f=foods.find(z=>z.id===x.id);if(f){a.kcal+=f.kcal*x.qty;a.p+=f.p*x.qty;a.c+=f.c*x.qty;a.f+=f.f*x.qty;}return a;},{kcal:0,p:0,c:0,f:0});
 const save=()=>{if(!items.length){notify("Add at least one food first");return;}setLogs(old=>[{id:"log"+Date.now(),date,member,kind,name:mealName.trim()||member+" "+kind,items:items.map(x=>({...x})),totals:{...totals}},...old]);setItems([]);setMealName("");notify("Meal saved. Pantry requirements updated.");};
 const addCustom=()=>{if(!form.name.trim()||form.kcal===""){notify("Enter food name and calories");return;}const f={id:"custom"+Date.now(),name:form.name.trim(),category:form.category,unit:form.unit||"serving",kcal:+form.kcal||0,p:+form.p||0,c:+form.c||0,f:+form.f||0,ingredients:form.ingredients};setFoods(old=>[f,...old]);add(f);setForm({name:"",category:"Packaged",unit:"serving",kcal:"",p:"",c:"",f:"",ingredients:""});setShowFood(false);};
 const start=range=>{const d=new Date();d.setHours(0,0,0,0);if(range==="Week")d.setDate(d.getDate()-6);if(range==="Month")d.setDate(1);return d;};
 const selectLogs=(range,person)=>logs.filter(x=>new Date(x.date+"T00:00:00")>=start(range)&&(person==="Both"||x.member===person));
 const analysed=selectLogs(period,who), sum=analysed.reduce((a,x)=>({kcal:a.kcal+x.totals.kcal,p:a.p+x.totals.p,c:a.c+x.totals.c,f:a.f+x.totals.f}),{kcal:0,p:0,c:0,f:0});
 const days=period==="Day"?1:period==="Week"?7:Math.max(1,new Date().getDate());
 const counts={};analysed.forEach(x=>counts[x.name]=(counts[x.name]||0)+1);const popular=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6);
 const pLogs=selectLogs(pantryPeriod,pantryWho), pantry={};pLogs.forEach(log=>log.items.forEach(it=>{const f=foods.find(z=>z.id===it.id);if(!f||!f.ingredients)return;String(f.ingredients).split(",").map(s=>s.trim()).filter(Boolean).forEach(n=>{const k=n.toLowerCase();if(!pantry[k])pantry[k]={name:n,qty:0};pantry[k].qty+=it.qty;});}));
 const exportData=()=>{const a=document.createElement("a"),u=URL.createObjectURL(new Blob([JSON.stringify({foods,logs},null,2)],{type:"application/json"}));a.href=u;a.download="gather-backup.json";a.click();URL.revokeObjectURL(u);};
 return <div className="app"><aside className="sidebar"><div className="brand"><div className="brandmark"><Leaf size={20}/></div><div><b>gather</b><small>eat well, simply</small></div></div><div className="navlabel">YOUR KITCHEN</div>{[["Meals",Utensils],["Analysis",ChartNoAxesCombined],["Pantry",Salad]].map(([n,I])=><button key={n} className={"nav "+(page===n?"active":"")} onClick={()=>setPage(n)}><I size={18}/>{n}</button>)}<div className="sidebottom"><div className="leafcard"><Salad size={20}/><b>Plan what you eat.</b><span>Log meals, spot patterns, plan your pantry.</span></div><button className="textbtn" onClick={exportData}><Download size={15}/> Export backup</button></div></aside><main className="main"><header className="topbar"><div className="mobilebrand"><Leaf size={18}/> gather</div><span className="eyebrow">HOUSEHOLD MEAL PLANNER</span></header>
 {page==="Meals"&&<section className="content"><div className="pageintro"><span className="eyebrow green">MEAL LOG</span><h1>Plan your <em>meals.</em></h1><p>Build meals from everyday foods and save them separately for Mitali and Abhinav.</p></div><div className="meal-layout"><div className="mealchoose panel"><div className="panelhead"><div><span className="eyebrow">FOOD LIBRARY</span><h2>Add foods to a meal</h2></div><button className="primary" onClick={()=>setShowFood(true)}><Plus size={15}/> Add food</button></div><div className="searchbox"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search protein bar, roti, dal, Maggi..."/></div><div className="filters">{["All","Indian meals","Protein","Dairy","Packaged","Snacks","Fruit","Other"].map(c=><button key={c} className={category===c?"filter activefilter":"filter"} onClick={()=>setCategory(c)}>{c}</button>)}</div>{visible.map(f=><div className="choose-row" key={f.id}><div className="choose-thumb">🥗</div><div className="choose-info"><b>{f.name}</b><small>{f.category} · {f.kcal} kcal / {f.unit} · {f.p}g protein</small></div><button className="addcircle" onClick={()=>add(f)}><Plus size={17}/></button></div>)}</div>
 <div className="meal-summary panel"><div className="panelhead"><div><span className="eyebrow">MEAL DETAILS</span><h2>Build & save</h2></div></div><label className="field-label">Who is this meal for?<select value={member} onChange={e=>setMember(e.target.value)}><option>Mitali</option><option>Abhinav</option></select></label><label className="field-label">Meal type<select value={kind} onChange={e=>setKind(e.target.value)}><option>Lunch</option><option>Dinner</option><option>Breakfast</option><option>Snack</option></select></label><label className="field-label">Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="field-label">Meal name<input value={mealName} onChange={e=>setMealName(e.target.value)} placeholder="e.g. Paneer, roti & dal"/></label>
 {items.length===0?<div className="emptymeal"><div>🍽️</div><b>Your meal starts here</b><p>Add food items. Portions can be 0.25, 0.5, 0.75 or any decimal quantity.</p></div>:<>{items.map(x=>{const f=foods.find(z=>z.id===x.id);return f?<div className="mealitem" key={x.id}><div><b>{f.name}</b><small>{f.kcal} kcal / {f.unit}</small></div><div className="qty-control"><button onClick={()=>setItems(old=>old.map(z=>z.id===x.id?{...z,qty:Math.max(.01,Math.round((z.qty-.25)*100)/100)}:z))}><Minus size={13}/></button><input type="number" min=".01" step=".05" value={x.qty} onChange={e=>setItems(old=>old.map(z=>z.id===x.id?{...z,qty:Math.max(.01,Number(e.target.value)||.01)}:z))}/><button onClick={()=>setItems(old=>old.map(z=>z.id===x.id?{...z,qty:Math.round((z.qty+.25)*100)/100}:z))}><Plus size={13}/></button><button className="remove-food" onClick={()=>setItems(old=>old.filter(z=>z.id!==x.id))}><X size={13}/></button></div></div>:null})}<div className="totals"><span className="eyebrow">MEAL TOTAL · ESTIMATED</span><strong>{Math.round(totals.kcal)} <small>kcal</small></strong><div className="totalmacros"><span><b>{totals.p.toFixed(1)}g</b> protein</span><span><b>{totals.c.toFixed(1)}g</b> carbs</span><span><b>{totals.f.toFixed(1)}g</b> fibre</span></div></div><button className="primary save-meal" onClick={save}><Save size={16}/> Save prepared meal</button><button className="clearbtn" onClick={()=>setItems([])}>Clear meal</button></>}</div></div>
 <div className="sectionhead"><div><span className="eyebrow">RECENTLY SAVED</span><h2>Meal history</h2></div></div><div className="history-list">{logs.slice(0,12).map(x=><div className="history-row" key={x.id}><div><b>{x.name}</b><small>{x.member} · {x.kind} · {x.date}</small></div><strong>{Math.round(x.totals.kcal)} kcal</strong></div>)}{!logs.length&&<p className="hint">Saved meals will appear here.</p>}</div></section>}
 {page==="Analysis"&&<section className="content"><div className="pageintro"><span className="eyebrow green">HOUSEHOLD INSIGHTS</span><h1>Your eating, <em>at a glance.</em></h1><p>Daily, weekly and monthly trends based on meals you save.</p></div><div className="analysis-controls"><div className="filters">{["Day","Week","Month"].map(x=><button key={x} className={period===x?"filter activefilter":"filter"} onClick={()=>setPeriod(x)}>{x}</button>)}</div><select value={who} onChange={e=>setWho(e.target.value)}><option>Both</option><option>Mitali</option><option>Abhinav</option></select></div><div className="nutritioncards">{[["Average calories / day",Math.round(sum.kcal/days),"kcal",sum.kcal+" kcal total"],["Average protein / day",(sum.p/days).toFixed(1),"g",sum.p.toFixed(1)+"g total protein"],["Average carbs / day",(sum.c/days).toFixed(1),"g","Estimated from logged foods"],["Average fibre / day",(sum.f/days).toFixed(1),"g","Estimated from logged foods"]].map(([label,val,unit,sub])=><div className="nutritioncard" key={label}><div><b>{label}</b><small>{period} view · {analysed.length} meals logged</small></div><strong>{val} <small>{unit}</small></strong><div className="nutribottom"><span>{sub}</span></div></div>)}</div><div className="panel analysis-panel"><div className="panelhead"><div><span className="eyebrow">MOST REPEATED</span><h2>Which meals get used most?</h2></div></div>{popular.length?popular.map(([n,c])=><div className="popular-row" key={n}><span>{n}</span><div className="popular-bar"><i style={{width:(c/popular[0][1]*100)+"%"}}/></div><b>{c}×</b></div>):<p className="hint">Save a few meals and your most-used meals will show here.</p>}</div><div className="panel analysis-panel"><p className="hint">These are averages of meals logged in Gather, not a complete dietary assessment. Log every meal for a meaningful daily picture. Packaged food values should be copied from the actual label.</p></div></section>}
 {page==="Pantry"&&<section className="content"><div className="pageintro"><span className="eyebrow green">SHOPPING & PREP</span><h1>Know your <em>pantry needs.</em></h1><p>Ingredient requirements are rolled up from meals you have saved.</p></div><div className="analysis-controls"><div className="filters">{["Day","Week","Month"].map(x=><button key={x} className={pantryPeriod===x?"filter activefilter":"filter"} onClick={()=>setPantryPeriod(x)}>{x}</button>)}</div><select value={pantryWho} onChange={e=>setPantryWho(e.target.value)}><option>Both</option><option>Mitali</option><option>Abhinav</option></select></div><div className="panel analysis-panel"><div className="panelhead"><div><span className="eyebrow">INGREDIENT ROLL-UP</span><h2>Estimated pantry requirement</h2></div><span className="muted">{pLogs.length} meals included</span></div>{Object.values(pantry).length?Object.values(pantry).sort((a,b)=>a.name.localeCompare(b.name)).map(x=><div className="pantry-row" key={x.name}><span>{x.name}</span><b>{x.qty.toFixed(2)} logged portions</b></div>):<p className="hint">No ingredient details yet. Add comma-separated ingredients when creating custom foods to include them in pantry planning.</p>}</div><div className="panel analysis-panel"><p className="hint">Pantry quantities are planning indicators, not stock levels. For packaged foods such as protein bars, the item itself is tracked; add ingredient details if you want its components included.</p></div></section>}
 </main>
 {showFood&&<div className="modalback"><div className="modal"><div className="modalhead"><div><span className="eyebrow green">FOOD LIBRARY</span><h2>Add any food item</h2></div><button className="iconbtn" onClick={()=>setShowFood(false)}><X/></button></div><div className="formgrid"><label className="wide">Food name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Yoga Bar protein bar / homemade kadhi"/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Packaged","Indian meals","Protein","Dairy","Snacks","Fruit","Other"].map(x=><option>{x}</option>)}</select></label><label>Unit / portion<input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/></label><label>Calories<input type="number" min="0" value={form.kcal} onChange={e=>setForm({...form,kcal:e.target.value})}/></label><label>Protein (g)<input type="number" min="0" value={form.p} onChange={e=>setForm({...form,p:e.target.value})}/></label><label>Carbs (g)<input type="number" min="0" value={form.c} onChange={e=>setForm({...form,c:e.target.value})}/></label><label>Fibre (g)<input type="number" min="0" value={form.f} onChange={e=>setForm({...form,f:e.target.value})}/></label><label className="wide">Ingredients for pantry (comma separated, optional)<input value={form.ingredients} onChange={e=>setForm({...form,ingredients:e.target.value})} placeholder="milk, besan, onion, tomato, oil"/></label></div><p className="hint">For packaged foods, use the nutrition label per bar or pack. For homemade Indian dishes, enter values per bowl, piece or serving.</p><div className="modalfoot"><button className="softbtn" onClick={()=>setShowFood(false)}>Cancel</button><button className="primary" onClick={addCustom}><Plus size={16}/> Add food to library</button></div></div></div>}
 {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
 </div>;
}
function macro(label,value,unit,Icon){return <div className="macroitem"><Icon/><div><b>{Math.round(value*10)/10} {unit}</b><small>{label} / serving</small></div></div>}
function RecipeCard({r,onOpen,onAdd,index=0}){let n=nutrition(r),rating=recipeRating(r),emojis=["🥑","🥘","🌯","🥪","🥒","🍝","🧆","🥖","🥞","🍢","🥟"];return <div className="recipecard"><button className="card-open" onClick={onOpen}><div className={"cardphoto photo"+(index%5)}><span>{emojis[index%emojis.length]}</span><small>{r.category}</small></div><div className="cardbody"><h3>{r.name}</h3><div className="cardmeta"><span><Flame size={13}/>{Math.round(n.kcal/r.servings)} kcal</span><span><Beef size={13}/>{(n.protein/r.servings).toFixed(1)}g protein</span></div><div className="card-rating"><b>{rating.score.toFixed(1)}/10</b><span>{rating.label}</span></div><div className="cardfoot"><span>{r.servings} {r.servings===1?"serving":"servings"} / batch</span><ChevronRight size={16}/></div></div></button><button className="tile-add" onClick={onAdd} aria-label="Add to meal"><Plus size={20}/></button></div>}

createRoot(document.getElementById("root")).render(<App/>);
