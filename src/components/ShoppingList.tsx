import React, { useState } from 'react';
import { IngredientSummary } from '../types';
import { ShoppingCart, Download } from 'lucide-react';

interface ShoppingListProps {
  items: IngredientSummary[];
  onOverrideWeight?: (name: string, grams: number) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onOverrideWeight }) => {
  const meatItems = items.filter(i => i.category === 'meat');
  const veggieItems = items.filter(i => i.category === 'veggie');
  const carbItems = items.filter(i => i.category === 'carb');
  const [editing, setEditing] = useState<null | { name: string; grams: string }>(null);

  const buildText = () => {
    const lines: string[] = [];
    const section = (title: string, list: IngredientSummary[]) => {
      lines.push(`【${title}】`);
      if (list.length === 0) {
        lines.push('无');
      } else {
        list.forEach(i => {
          if (i.name === '鸡蛋') {
            const cnt = Math.ceil(i.totalWeight / 50);
            lines.push(`${i.name} ${cnt}个`);
          } else {
            lines.push(`${i.name} ${i.totalWeight}g`);
          }
        });
      }
      lines.push('');
    };
    section('肉类', meatItems);
    section('蔬菜', veggieItems);
    if (carbItems.length > 0) section('碳水/其他', carbItems);
    return lines.join('\n');
  };

  const onExportTxt = () => {
    const text = buildText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '采购单.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onExportPng = () => {
    const text = buildText().split('\n');
    const lineHeight = 24;
    const width = 800;
    const padding = 20;
    const height = padding * 2 + lineHeight * (text.length + 3);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 20px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText('智能采购单', padding, padding + 10);
    ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto';
    let y = padding + 40;
    text.forEach(line => {
      ctx.fillText(line, padding, y);
      y += lineHeight;
    });
    canvas.toBlob(b => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = url;
      a.download = '采购单.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  };

  const renderSection = (title: string, list: IngredientSummary[], colorClass: string) => (
    <div className="mb-6">
      <h3 className={`font-bold text-sm uppercase tracking-wider mb-2 ${colorClass}`}>{title} ({list.reduce((a,b) => a + b.totalWeight, 0)}g)</h3>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 italic">无</p>
      ) : (
        <ul className="space-y-2">
          {list.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded border-l-4 border-l-transparent hover:border-l-indigo-500 transition-all">
              <div>
                <span className="font-medium text-gray-800">{item.name}</span>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">
                  来源: {item.sources.join(', ')}
                </p>
              </div>
              {item.name === '鸡蛋' ? (
                <span 
                  className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm cursor-pointer"
                  onDoubleClick={() => setEditing({ name: item.name, grams: String(Math.ceil(item.totalWeight / 50)) })}
                  title="双击编辑个数"
                >
                  {editing?.name === item.name ? (
                    <input
                      value={editing.grams}
                      onChange={(e) => setEditing({ name: item.name, grams: e.target.value.replace(/[^0-9]/g, '') })}
                      onBlur={() => {
                        const cnt = parseInt(editing!.grams) || 0;
                        onOverrideWeight && onOverrideWeight(item.name, cnt * 50);
                        setEditing(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const cnt = parseInt(editing!.grams) || 0;
                          onOverrideWeight && onOverrideWeight(item.name, cnt * 50);
                          setEditing(null);
                        }
                      }}
                      className="w-16 text-indigo-700 bg-white border border-indigo-300 rounded px-1 py-0.5 text-sm"
                      autoFocus
                    />
                  ) : (
                    <>{Math.ceil(item.totalWeight / 50)}个</>
                  )}
                </span>
              ) : (
                <span 
                  className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm cursor-pointer"
                  onDoubleClick={() => setEditing({ name: item.name, grams: String(item.totalWeight) })}
                  title="双击编辑克数"
                >
                  {editing?.name === item.name ? (
                    <input
                      value={editing.grams}
                      onChange={(e) => setEditing({ name: item.name, grams: e.target.value.replace(/[^0-9]/g, '') })}
                      onBlur={() => {
                        const v = parseInt(editing!.grams) || 0;
                        onOverrideWeight && onOverrideWeight(item.name, v);
                        setEditing(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = parseInt(editing!.grams) || 0;
                          onOverrideWeight && onOverrideWeight(item.name, v);
                          setEditing(null);
                        }
                      }}
                      className="w-16 text-indigo-700 bg-white border border-indigo-300 rounded px-1 py-0.5 text-sm"
                      autoFocus
                    />
                  ) : (
                    <>{item.totalWeight}g</>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-indigo-600" /> 智能采购单
        </h2>
        <div className="flex gap-2">
          <button onClick={onExportTxt} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-sm">
            <Download size={16} /> 导出TXT
          </button>
          <button onClick={onExportPng} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-sm">
            <Download size={16} /> 导出图片
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {renderSection('🥩 肉类', meatItems, 'text-red-600')}
        </div>
        <div>
          {renderSection('🥬 蔬菜', veggieItems, 'text-green-600')}
          {carbItems.length > 0 && renderSection('🍚 碳水/其他', carbItems, 'text-yellow-600')}
        </div>
      </div>
    </div>
  );
};
