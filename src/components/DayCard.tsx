import React, { useState } from 'react';
import { DayMenu, Dish, Settings } from '../types';
import { RefreshCw, AlertTriangle, Plus, Trash2, Search, Edit } from 'lucide-react';
import { calculateDailyIngredients } from '../lib/logic';

interface DayCardProps {
  dayMenu: DayMenu;
  settings: Settings;
  onSwapDish: (dayIndex: number, dishIndex: number, preference?: 'meat' | 'veggie') => void;
  onAddDish: (dayIndex: number, preference?: 'meat' | 'veggie') => void;
  onRemoveDish?: (dayIndex: number, dishIndex: number) => void;
  dishesLib?: Dish[];
  onSetDish?: (dayIndex: number, dishIndex: number, dish: Dish) => void;
  onAddSpecificDish?: (dayIndex: number, dish: Dish) => void;
  onEditDishLibrary?: (dish: Dish) => void;
  onEatOut?: () => void;
}

export const DayCard: React.FC<DayCardProps> = ({ dayMenu, settings, onSwapDish, onAddDish, onRemoveDish, dishesLib = [], onSetDish, onAddSpecificDish, onEditDishLibrary, onEatOut }) => {
  const [swapPref, setSwapPref] = useState<'any' | 'meat' | 'veggie'>('any');
  const [showPicker, setShowPicker] = useState<null | { mode: 'replace' | 'add'; dishIndex?: number }>(null);
  const [query, setQuery] = useState('');
  const [prefOpen, setPrefOpen] = useState(false);
  const [edit, setEdit] = useState<null | { index: number; name: string; ings: { name: string; category: 'veggie' | 'meat' | 'carb' }[] }>(null);

  const ingredients = calculateDailyIngredients(dayMenu, settings);
  const totalMeat = ingredients.filter(i => i.category === 'meat').reduce((acc, curr) => acc + curr.totalWeight, 0);
  const totalVeg = ingredients.filter(i => i.category === 'veggie').reduce((acc, curr) => acc + curr.totalWeight, 0);
  const hasCarb = (dayMenu.dishes || []).some(d => d.ingredients.some(i => i.category === 'carb'));

  // Check for "Red Light"
  const meatTargetTotal = settings.peopleCount * settings.targetMeat;
  const vegTargetTotal = settings.peopleCount * settings.targetVeggie;
  
  // Simple check: if we have 0 meat but target > 0
  const missingMeat = meatTargetTotal > 0 && totalMeat === 0;
  const missingVeg = vegTargetTotal > 0 && totalVeg === 0;

  const renderDish = (dish: Dish, index: number) => {
    return (
      <div className="flex-1 p-3 bg-gray-50 rounded border border-gray-100 relative group" onDoubleClick={() => setEdit({ index, name: dish.name, ings: dish.ingredients.map(i => ({ ...i })) })}>
        <div className="font-bold text-lg text-gray-800">{dish.name}</div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {dish.ingredients.map((ing, idx) => (
            <span key={idx} className={`text-xs px-1.5 py-0.5 rounded ${
              ing.category === 'meat' ? 'bg-red-100 text-red-700' : 
              ing.category === 'veggie' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {ing.name}
            </span>
          ))}
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-white shadow-lg rounded p-1 border">
          <button 
            onClick={() => onSwapDish(dayMenu.dayIndex, index, swapPref === 'any' ? undefined : swapPref)}
            className="p-1 hover:bg-indigo-50 text-indigo-600 rounded"
            title="换一菜"
          >
            <RefreshCw size={14} />
          </button>
          {onSetDish && (
            <button 
              onClick={() => setShowPicker({ mode: 'replace', dishIndex: index })}
              className="p-1 hover:bg-indigo-50 text-indigo-600 rounded"
              title="从库选择替换"
            >
              <Search size={14} />
            </button>
          )}
          {onRemoveDish && (
            <button 
              onClick={() => onRemoveDish(dayMenu.dayIndex, index)}
              className="p-1 hover:bg-red-50 text-red-600 rounded"
              title="移除该菜"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-700">第 {dayMenu.dayIndex + 1} 天</h3>
        <div className="flex gap-2 text-xs">
          {prefOpen ? (
            <select 
              className="border rounded px-1 py-0.5 text-gray-600 bg-gray-50"
              value={swapPref}
              onChange={(e) => { setSwapPref(e.target.value as any); setPrefOpen(false); }}
            >
              <option value="any">🎲 随机换</option>
              <option value="meat">🥩 换肉菜</option>
              <option value="veggie">🥬 换素菜</option>
            </select>
          ) : (
            <button
              onClick={() => setPrefOpen(true)}
              className="inline-flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded"
              title={swapPref === 'any' ? '🎲 随机换' : swapPref === 'meat' ? '🥩 换肉菜' : '🥬 换素菜'}
            >
              <span>{swapPref === 'any' ? '🎲' : swapPref === 'meat' ? '🥩' : '🥬'}</span>
            </button>
          )}
          <button
            onClick={() => onAddDish(dayMenu.dayIndex, swapPref === 'any' ? undefined : swapPref)}
            className="inline-flex items-center justify-center w-7 h-7 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded"
            title="添加菜"
          >
            <Plus size={14} />
          </button>
          {onAddSpecificDish && (
            <button
              onClick={() => setShowPicker({ mode: 'add' })}
              className="inline-flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded"
              title="从库选择"
            >
              <Search size={14} />
            </button>
          )}
        </div>
      </div>

      {(missingMeat || missingVeg) && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded flex items-center gap-2 animate-pulse">
          <AlertTriangle size={14} />
          <span>
            {missingMeat && '缺乏肉类蛋白! '}
            {missingVeg && '缺乏蔬菜! '}
            建议换菜。
          </span>
        </div>
      )}
      {hasCarb && (
        <div className="mb-3 p-2 bg-yellow-50 text-yellow-700 text-xs rounded">
          存在隐形碳水，注意整体碳水摄入。
        </div>
      )}

      <div className="flex flex-col gap-2">
        {(dayMenu.dishes || []).map((d, idx) => renderDish(d, idx))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-center">
        <button
          onClick={onEatOut}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50"
          title="出去吃一顿（并记录为菜品）"
        >
          出去吃一顿
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-center">
        {(() => {
          const share = dayMenu.mealShare ?? 1;
          const vegQuota = Math.round(settings.peopleCount * settings.targetVeggie * share);
          const meatQuota = Math.round(settings.peopleCount * settings.targetMeat * share);
          return <>蔬菜 {vegQuota}g，肉类 {meatQuota}g</>;
        })()}
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded shadow-lg border">
            <div className="p-3 border-b flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索菜名/食材"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setShowPicker(null)}>关闭</button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {dishesLib
                .filter(d => {
                  const q = query.trim();
                  if (!q) return true;
                  const hay = (d.name + ' ' + d.ingredients.map(i => i.name).join(' ')).toLowerCase();
                  return hay.includes(q.toLowerCase());
                })
                .map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border">
                    <div>
                      <div className="font-medium text-sm">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.ingredients.map(i => i.name).join(', ')}</div>
                    </div>
                    <button
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                      onClick={() => {
                        if (showPicker.mode === 'replace' && onSetDish && showPicker.dishIndex !== undefined) {
                          onSetDish(dayMenu.dayIndex, showPicker.dishIndex, d);
                        } else if (showPicker.mode === 'add' && onAddSpecificDish) {
                          onAddSpecificDish(dayMenu.dayIndex, d);
                        }
                        setShowPicker(null);
                        setQuery('');
                      }}
                    >
                      选择
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
      {edit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setEdit(null)}>
          <div className="bg-white w-full max-w-lg rounded shadow-lg border" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 border-b flex items-center gap-2">
              <Edit size={16} className="text-gray-500" />
              <span className="font-semibold text-sm">编辑菜品</span>
            </div>
            <div className="p-3 space-y-3">
              <input
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {edit.ings.map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      value={ing.name}
                      onChange={(e) => {
                        const arr = [...edit.ings];
                        arr[idx] = { ...arr[idx], name: e.target.value };
                        setEdit({ ...edit, ings: arr });
                      }}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                    <select
                      value={ing.category}
                      onChange={(e) => {
                        const arr = [...edit.ings];
                        arr[idx] = { ...arr[idx], category: e.target.value as any };
                        setEdit({ ...edit, ings: arr });
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="veggie">素</option>
                      <option value="meat">肉</option>
                      <option value="carb">碳水</option>
                    </select>
                    <button
                      onClick={() => {
                        const arr = [...edit.ings];
                        arr.splice(idx, 1);
                        setEdit({ ...edit, ings: arr });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setEdit({ ...edit, ings: [...edit.ings, { name: '', category: 'veggie' }] })}
                  className="text-sm text-indigo-600"
                >
                  + 添加食材
                </button>
              </div>
            </div>
            <div className="p-3 border-t flex justify-end gap-2">
              <button onClick={() => setEdit(null)} className="px-3 py-1.5 rounded border text-sm">取消</button>
              <button
                onClick={() => {
                  if (!edit) return;
                  const updated: Dish = {
                    id: dayMenu.dishes[edit.index].id,
                    name: edit.name,
                    ingredients: edit.ings,
                    tags: dayMenu.dishes[edit.index].tags
                  };
                  if (onSetDish) onSetDish(dayMenu.dayIndex, edit.index, updated);
                  if (onEditDishLibrary) onEditDishLibrary(updated);
                  setEdit(null);
                }}
                className="px-3 py-1.5 rounded bg-green-600 text-white text-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
