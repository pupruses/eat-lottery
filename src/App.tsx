import { useState, useEffect, useCallback } from 'react';
import { Dish, DayMenu, Settings } from './types';
import { INITIAL_DISHES } from './lib/initialData';
import { getRandomDish, generateShoppingList } from './lib/logic';
import { Sidebar } from './components/Sidebar';
import { DayCard } from './components/DayCard';
import { ShoppingList } from './components/ShoppingList';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'eat-lottery-data-v1';

function App() {
  const initialData = (() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const data = JSON.parse(savedRaw);
        return {
          dishes: (data.dishes as Dish[]) ?? INITIAL_DISHES,
          settings: (data.settings as Settings) ?? {
            peopleCount: 2,
            daysCount: 4,
            targetVeggie: 400,
            targetMeat: 160,
          },
          schedule: (data.schedule as DayMenu[]) ?? [],
        };
      }
    } catch {}
    return {
      dishes: INITIAL_DISHES,
      settings: {
        peopleCount: 2,
        daysCount: 4,
        targetVeggie: 400,
        targetMeat: 160,
      } as Settings,
      schedule: [] as DayMenu[],
    };
  })();

  const [dishes, setDishes] = useState<Dish[]>(initialData.dishes);
  const [settings, setSettings] = useState<Settings>(initialData.settings);
  const [schedule, setSchedule] = useState<DayMenu[]>(initialData.schedule);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dishes, settings, schedule }));
  }, [dishes, settings, schedule]);

  // --- Handlers ---

  const handleGenerateSchedule = useCallback((days: number, currentDishes: Dish[]) => {
    const newSchedule: DayMenu[] = [];
    for (let i = 0; i < days; i++) {
      newSchedule.push({
        dayIndex: i,
        mealShare: 1,
        dishes: [
          getRandomDish(currentDishes, [], 'balanced'),
          getRandomDish(currentDishes, [], 'balanced')
        ].filter((d): d is Dish => !!d)
      });
    }
    setSchedule(newSchedule);
  }, []);

  // If schedule is empty (first run), generate based on current settings/dishes
  useEffect(() => {
    if (schedule.length === 0) {
      handleGenerateSchedule(settings.daysCount, dishes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-generate when day count changes
  useEffect(() => {
    if (schedule.length !== settings.daysCount) {
      // Resize schedule
      if (settings.daysCount > schedule.length) {
        // Add days
        const addedDays: DayMenu[] = [];
        for (let i = schedule.length; i < settings.daysCount; i++) {
          addedDays.push({
            dayIndex: i,
            mealShare: 1,
            dishes: [getRandomDish(dishes), getRandomDish(dishes)].filter((d): d is Dish => !!d)
          });
        }
        setSchedule([...schedule, ...addedDays]);
      } else {
        // Remove days
        setSchedule(schedule.slice(0, settings.daysCount));
      }
    }
  }, [settings.daysCount, dishes]);

  const handleSwapDish = (dayIndex: number, dishIndex: number, preference?: 'meat' | 'veggie') => {
    const currentDishId = schedule[dayIndex].dishes[dishIndex]?.id;
    const excludeIds = currentDishId ? [currentDishId] : [];
    schedule.forEach(day => {
      day.dishes.forEach(d => excludeIds.push(d.id));
    });

    let newDish = getRandomDish(dishes, excludeIds, preference);
    if (!newDish) {
      newDish = getRandomDish(dishes, currentDishId ? [currentDishId] : [], preference);
    }

    const newSchedule = [...schedule];
    const day = { ...newSchedule[dayIndex] };
    const dishesCopy = [...day.dishes];
    if (newDish) dishesCopy[dishIndex] = newDish;
    day.dishes = dishesCopy;
    newSchedule[dayIndex] = day;
    setSchedule(newSchedule);
  };

  const handleAddDishToDay = (dayIndex: number, preference?: 'meat' | 'veggie') => {
    const excludeIds = schedule[dayIndex].dishes.map(d => d.id);
    let newDish = getRandomDish(dishes, excludeIds, preference);
    if (!newDish) newDish = getRandomDish(dishes, [], preference);
    if (!newDish) return;
    const newSchedule = [...schedule];
    const day = { ...newSchedule[dayIndex] };
    day.dishes = [...day.dishes, newDish];
    newSchedule[dayIndex] = day;
    setSchedule(newSchedule);
  };

  const handleRemoveDishFromDay = (dayIndex: number, dishIndex: number) => {
    const newSchedule = [...schedule];
    const day = { ...newSchedule[dayIndex] };
    const arr = [...day.dishes];
    const removed = arr[dishIndex];
    arr.splice(dishIndex, 1);
    day.dishes = arr;
    if (removed?.name === '出去吃一顿') {
      const share = day.mealShare ?? 0;
      day.mealShare = Math.min(1, share + 0.5);
    }
    newSchedule[dayIndex] = day;
    setSchedule(newSchedule);
  };

  const handleFullRedraw = () => {
    if (confirm('确定要重新抽取所有几天的菜单吗？')) {
      handleGenerateSchedule(settings.daysCount, dishes);
    }
  };

  const shoppingList = generateShoppingList(schedule, settings);
  const [shoppingOverrides, setShoppingOverrides] = useState<Record<string, number>>({});
  const shoppingListView = shoppingList.map(item => shoppingOverrides[item.name] !== undefined ? { ...item, totalWeight: shoppingOverrides[item.name] } : item);
  const handleOverrideWeight = (name: string, grams: number) => {
    setShoppingOverrides(prev => ({ ...prev, [name]: grams }));
  };
  const handleEatOut = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const day = { ...newSchedule[dayIndex] };
    const share = day.mealShare ?? 1;
    day.mealShare = Math.max(0, share - 0.5);
    // add "出去吃一顿" dish into the day schedule
    const eatOutDish: Dish = {
      id: crypto.randomUUID(),
      name: '出去吃一顿',
      ingredients: [],
      tags: ['外食']
    };
    day.dishes = [...day.dishes, eatOutDish];
    newSchedule[dayIndex] = day;
    setSchedule(newSchedule);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="bg-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🍱 吃饭盲盒 (Eat Lottery)
          </h1>
          <button 
            onClick={handleFullRedraw}
            className="bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={16} /> 一键重抽
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Sidebar (Settings + Dish Entry) - 3 Columns */}
        <aside className="lg:col-span-3 space-y-6">
          <Sidebar 
            settings={settings} 
            onUpdateSettings={setSettings}
            dishes={dishes}
            onAddDish={(d) => setDishes([...dishes, d])}
            onDeleteDish={(id) => setDishes(dishes.filter(d => d.id !== id))}
            onEditDish={(dish) => setDishes(dishes.map(x => x.id === dish.id ? dish : x))}
          />
        </aside>

        {/* Center (Schedule) - 9 Columns */}
        <section className="lg:col-span-9 space-y-8">
          {/* Day Cards Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-indigo-500 pl-3">
              📅 本周食谱 ({settings.daysCount}天)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {schedule.map((day) => (
                <DayCard 
                  key={day.dayIndex} 
                  dayMenu={day} 
                  settings={settings}
                  onSwapDish={handleSwapDish}
                  onAddDish={handleAddDishToDay}
                  onRemoveDish={handleRemoveDishFromDay}
                  dishesLib={dishes}
                  onSetDish={(dayIndex, dishIndex, dish) => {
                    const newSchedule = [...schedule];
                    const day = { ...newSchedule[dayIndex] };
                    const arr = [...day.dishes];
                    arr[dishIndex] = dish;
                    day.dishes = arr;
                    newSchedule[dayIndex] = day;
                    setSchedule(newSchedule);
                  }}
                  onAddSpecificDish={(dayIndex, dish) => {
                    const newSchedule = [...schedule];
                    const day = { ...newSchedule[dayIndex] };
                    day.dishes = [...day.dishes, dish];
                    newSchedule[dayIndex] = day;
                    setSchedule(newSchedule);
                  }}
                  onEditDishLibrary={(dish) => setDishes(dishes.map(x => x.id === dish.id ? dish : x))}
                  onEatOut={() => handleEatOut(day.dayIndex)}
                />
              ))}
            </div>
          </div>

          {/* Shopping List */}
          <ShoppingList items={shoppingListView} onOverrideWeight={handleOverrideWeight} />
        </section>
      </main>
    </div>
  );
}

export default App;
