import React, { useState } from 'react';
import { Dish, Ingredient, IngredientCategory } from '../types';
import { Plus, Trash2, Save, Pencil, Search } from 'lucide-react';

interface DishManagerProps {
  dishes: Dish[];
  onAddDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onEditDish: (dish: Dish) => void;
}

export const DishManager: React.FC<DishManagerProps> = ({ dishes, onAddDish, onDeleteDish, onEditDish }) => {
  const [newDishName, setNewDishName] = useState('');
  const [newIngredients, setNewIngredients] = useState<Ingredient[]>([]);
  const [tempIngName, setTempIngName] = useState('');
  const [tempIngCat, setTempIngCat] = useState<IngredientCategory>('veggie');
  const [editing, setEditing] = useState<null | Dish>(null);
  const [editName, setEditName] = useState('');
  const [editIngredients, setEditIngredients] = useState<Ingredient[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddIngredient = () => {
    if (!tempIngName.trim()) return;
    setNewIngredients([...newIngredients, { name: tempIngName, category: tempIngCat }]);
    setTempIngName('');
  };

  const handleSaveDish = () => {
    if (!newDishName.trim() || newIngredients.length === 0) return;
    const newDish: Dish = {
      id: crypto.randomUUID(),
      name: newDishName,
      ingredients: newIngredients,
      tags: []
    };
    onAddDish(newDish);
    setNewDishName('');
    setNewIngredients([]);
    // keep panel open
  };

  const openEdit = (dish: Dish) => {
    setEditing(dish);
    setEditName(dish.name);
    setEditIngredients(dish.ingredients.map(i => ({ ...i })));
  };

  const saveEdit = () => {
    if (!editing) return;
    if (!editName.trim() || editIngredients.length === 0) return;
    onEditDish({ ...editing, name: editName, ingredients: editIngredients });
    setEditing(null);
    setEditName('');
    setEditIngredients([]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🍳</span> 菜谱工坊
        </h2>
      </div>

        <div className="mt-4 space-y-4">
          <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
            <label className="block text-sm font-medium text-gray-700">菜品名称</label>
            <input 
              type="text" 
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="例如：西红柿鸡蛋"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">添加食材</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  value={tempIngName}
                  onChange={(e) => setTempIngName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="食材名称"
                />
                <select 
                  value={tempIngCat}
                  onChange={(e) => setTempIngCat(e.target.value as IngredientCategory)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="veggie">素</option>
                  <option value="meat">肉</option>
                  <option value="carb">碳水</option>
                </select>
                <button 
                  onClick={handleAddIngredient}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {newIngredients.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {newIngredients.map((ing, idx) => (
                  <span key={idx} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ing.category === 'meat' ? 'bg-red-100 text-red-800' : 
                    ing.category === 'veggie' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ing.name}
                    <button 
                      onClick={() => setNewIngredients(newIngredients.filter((_, i) => i !== idx))}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button 
              onClick={handleSaveDish}
              disabled={!newDishName || newIngredients.length === 0}
              className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300"
            >
              <Save size={16} className="mr-2" /> 保存并加入库
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">已有菜品库 ({dishes.length})</h3>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-600 hover:text-gray-800"
                title="查找"
              >
                <Search size={16} />
              </button>
            </div>
            {showSearch && (
              <div className="flex gap-2 mb-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索菜名或食材"
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                  title="清空"
                >
                  清空
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {dishes
                .filter(d => {
                  const q = searchQuery.trim().toLowerCase();
                  if (!q) return true;
                  const hay = (d.name + ' ' + d.ingredients.map(i => i.name).join(' ')).toLowerCase();
                  return hay.includes(q);
                })
                .map(dish => (
                <div key={dish.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100 text-sm" onDoubleClick={() => openEdit(dish)}>
                  <div>
                    <span className="font-medium">{dish.name}</span>
                    <div className="text-xs text-gray-500">
                      {dish.ingredients.map(i => i.name).join(', ')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <button 
                      onClick={() => openEdit(dish)}
                      className="text-indigo-500 hover:text-indigo-700"
                      title="编辑"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteDish(dish.id)}
                      className="text-red-400 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
            <div className="bg-white w-full max-w-xl rounded shadow-lg border" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b font-semibold">编辑菜品</div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">菜品名称</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">食材</label>
                    <button
                      onClick={() => setEditIngredients([...editIngredients, { name: '', category: 'veggie' }])}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 添加
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {editIngredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          value={ing.name}
                          onChange={(e) => {
                            const arr = [...editIngredients];
                            arr[idx] = { ...arr[idx], name: e.target.value };
                            setEditIngredients(arr);
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="食材名称"
                        />
                        <select
                          value={ing.category}
                          onChange={(e) => {
                            const arr = [...editIngredients];
                            arr[idx] = { ...arr[idx], category: e.target.value as IngredientCategory };
                            setEditIngredients(arr);
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                          <option value="veggie">素</option>
                          <option value="meat">肉</option>
                          <option value="carb">碳水</option>
                        </select>
                        <button
                          onClick={() => {
                            const arr = [...editIngredients];
                            arr.splice(idx, 1);
                            setEditIngredients(arr);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="移除"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded border">取消</button>
                <button onClick={saveEdit} className="px-3 py-1.5 rounded bg-green-600 text-white">保存</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
