import { Dish, DayMenu, Settings, IngredientSummary, IngredientCategory } from '../types';

// Helper to round up to nearest 50
export const roundTo50 = (num: number): number => {
  return Math.ceil(num / 50) * 50;
};

// Module 4: Dynamic Quota Algorithm
export const calculateDailyIngredients = (
  dayMenu: DayMenu, 
  settings: Settings
): IngredientSummary[] => {
  const dishes = dayMenu.dishes || [];
  
  if (dishes.length === 0) return [];

  // 1. Calculate Daily Totals needed
  const share = dayMenu.mealShare ?? 1;
  const dailyVeggieTarget = settings.peopleCount * settings.targetVeggie * share;
  const dailyMeatTarget = settings.peopleCount * settings.targetMeat * share;

  // 2. Extract all ingredients for the day
  const allIngredients = dishes.flatMap(d => d.ingredients.map(i => ({ ...i, dishName: d.name })));
  
  // 3. Count pools
  const veggieCount = allIngredients.filter(i => i.category === 'veggie').length;
  const meatCount = allIngredients.filter(i => i.category === 'meat').length;
  
  // 4. Calculate unit weights
  // Avoid division by zero
  const veggieUnitWeight = veggieCount > 0 ? dailyVeggieTarget / veggieCount : 0;
  const meatUnitWeight = meatCount > 0 ? dailyMeatTarget / meatCount : 0;

  // 5. Map to summaries
  const summaries: IngredientSummary[] = [];

  // Helper map to merge same ingredients within a day
  const map = new Map<string, IngredientSummary>();

  allIngredients.forEach(ing => {
    if (ing.category === 'carb') return; // Skip carbs for calculation for now unless specified

    const weightRaw = ing.category === 'veggie' ? veggieUnitWeight : meatUnitWeight;
    // We apply rounding at the SHOPPING LIST level usually, but the user example said:
    // "Celery = 800 / 2 = 400". 
    // If we have 2 Celery dishes, is it 800? 
    // User says "Celery Stir-fry" and "Chili Stir-fry". 
    // Celery = 400. Chili = 400.
    // If "Celery Stir-fry" had {Celery, Chili}, then Celery=266, Chili=266...
    // Let's stick to the "Pool" logic: Total Weight / Total Items.

    const existing = map.get(ing.name);
    if (existing) {
      existing.totalWeight += weightRaw;
      if (!existing.sources.includes(ing.dishName)) {
        existing.sources.push(ing.dishName);
      }
    } else {
      map.set(ing.name, {
        name: ing.name,
        category: ing.category,
        totalWeight: weightRaw,
        sources: [ing.dishName]
      });
    }
  });

  return Array.from(map.values());
};

// Module 5: Shopping List Aggregation
export const generateShoppingList = (
  schedule: DayMenu[],
  settings: Settings
): IngredientSummary[] => {
  const finalMap = new Map<string, IngredientSummary>();

  schedule.forEach(day => {
    const dayIngredients = calculateDailyIngredients(day, settings);
    
    dayIngredients.forEach(item => {
      const existing = finalMap.get(item.name);
      if (existing) {
        existing.totalWeight += item.totalWeight;
        // Merge sources uniquely
        item.sources.forEach(s => {
          if (!existing.sources.includes(s)) existing.sources.push(s);
        });
      } else {
        finalMap.set(item.name, { ...item }); // clone
      }
    });
  });

  // Apply rounding at the very end (Total List)
  return Array.from(finalMap.values()).map(item => ({
    ...item,
    totalWeight: roundTo50(item.totalWeight)
  })).sort((a, b) => {
    if (a.category !== b.category) return a.category === 'meat' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};

// Lottery Logic
export const getRandomDish = (dishes: Dish[], excludeIds: string[] = [], filterType?: 'meat' | 'veggie' | 'balanced'): Dish | null => {
  let candidates = dishes.filter(d => !excludeIds.includes(d.id));
  
  if (filterType) {
    if (filterType === 'meat') {
      candidates = candidates.filter(d => d.ingredients.some(i => i.category === 'meat'));
    } else if (filterType === 'veggie') {
      candidates = candidates.filter(d => d.ingredients.every(i => i.category !== 'meat'));
    }
    // 'balanced' logic could be complex, skipping for MVP simple random
  }

  if (candidates.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
};
