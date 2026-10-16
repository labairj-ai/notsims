// One serving preserves existing solo prices. A shared purchase covers both people.
export const MEAL_PRICES=Object.freeze({prepared:8,cooked:12,snack:0});
export const SHARED_MEAL_PORTIONS=2;
export const sharedMealCost=id=>id==='shared_eat'?MEAL_PRICES.prepared*SHARED_MEAL_PORTIONS:id==='shared_cook'?MEAL_PRICES.cooked*SHARED_MEAL_PORTIONS:0;
