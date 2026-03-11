export type IngredientCategory = 'veggie' | 'meat' | 'carb';

export interface Ingredient {
  name: string;
  category: IngredientCategory;
}

export interface Dish {
  id: string;
  name: string;
  ingredients: Ingredient[];
  tags?: string[];
}

export interface DayMenu {
  dayIndex: number;
  dishes: Dish[];
  mealShare?: number;
}

export interface Settings {
  peopleCount: number;
  daysCount: number;
  targetVeggie: number; // grams per person per day
  targetMeat: number; // grams per person per day
}

export interface IngredientSummary {
  name: string;
  category: IngredientCategory;
  totalWeight: number;
  sources: string[]; // which dishes contributed
}
