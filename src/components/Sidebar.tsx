import React, { useState } from 'react';
import { Settings, Dish } from '../types';
import { Users, Calendar, Leaf, Beef } from 'lucide-react';
import { DishManager } from './DishManager';

interface SidebarProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  dishes: Dish[];
  onAddDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onEditDish: (dish: Dish) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ settings, onUpdateSettings, dishes, onAddDish, onDeleteDish, onEditDish }) => {
  const [healthOpen, setHealthOpen] = useState(false);
  const handleChange = (key: keyof Settings, value: number) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🛠️</span> 餐食驾驶舱
      </h2>

      <div className="space-y-6">
        <div>
         
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                <Users size={14} className="mr-1" /> 就餐人数
              </label>
              <input 
                type="number" 
                min={1}
                value={settings.peopleCount}
                onChange={(e) => handleChange('peopleCount', parseInt(e.target.value) || 1)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
              />
            </div>
            <div>
              <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                <Calendar size={14} className="mr-1" /> 备餐天数
              </label>
              <input 
                type="number" 
                min={1}
                max={14}
                value={settings.daysCount}
                onChange={(e) => handleChange('daysCount', parseInt(e.target.value) || 1)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => setHealthOpen(!healthOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm"
          >
            <span className="flex items-center gap-2">
              <span>健康目标 (人/日)</span>
            </span>
            <span className="text-gray-500">{healthOpen ? '收起' : '展开'}</span>
          </button>
          {healthOpen && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                  <Leaf size={14} className="mr-1 text-green-600" /> 蔬菜目标(g)
                </label>
                <input 
                  type="number" 
                  step={50}
                  value={settings.targetVeggie}
                  onChange={(e) => handleChange('targetVeggie', parseInt(e.target.value) || 0)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                  <Beef size={14} className="mr-1 text-red-600" /> 肉类目标(g)
                </label>
                <input 
                  type="number" 
                  step={50}
                  value={settings.targetMeat}
                  onChange={(e) => handleChange('targetMeat', parseInt(e.target.value) || 0)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <DishManager
            dishes={dishes}
            onAddDish={onAddDish}
            onDeleteDish={onDeleteDish}
            onEditDish={onEditDish}
          />
        </div>
      </div>
    </div>
  );
};
