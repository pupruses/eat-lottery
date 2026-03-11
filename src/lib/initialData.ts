import { Dish } from '../types';

export const INITIAL_DISHES: Dish[] = [
  {
    id: '1',
    name: '芹菜炒肉',
    ingredients: [
      { name: '芹菜', category: 'veggie' },
      { name: '猪肉', category: 'meat' }
    ],
    tags: ['家常菜']
  },
  {
    id: '2',
    name: '辣椒炒肉',
    ingredients: [
      { name: '青椒', category: 'veggie' },
      { name: '猪肉', category: 'meat' }
    ],
    tags: ['辣']
  },
  {
    id: '3',
    name: '地三鲜',
    ingredients: [
      { name: '土豆', category: 'veggie' }, // User note: could be carb
      { name: '茄子', category: 'veggie' },
      { name: '青椒', category: 'veggie' }
    ],
    tags: ['素']
  },
  {
    id: '4',
    name: '西红柿炒鸡蛋',
    ingredients: [
      { name: '西红柿', category: 'veggie' },
      { name: '鸡蛋', category: 'meat' } // Egg is protein/meat category for shopping purposes usually
    ],
    tags: ['快手']
  },
  {
    id: '5',
    name: '红烧排骨',
    ingredients: [
      { name: '排骨', category: 'meat' }
    ],
    tags: ['硬菜']
  },
  {
    id: '6',
    name: '酸辣土豆丝',
    ingredients: [
      { name: '土豆', category: 'veggie' },
      { name: '干辣椒', category: 'veggie' }
    ],
    tags: ['素', '辣']
  },
  {
    id: '7',
    name: '宫保鸡丁',
    ingredients: [
      { name: '鸡胸肉', category: 'meat' },
      { name: '花生米', category: 'veggie' },
      { name: '胡萝卜', category: 'veggie' },
      { name: '黄瓜', category: 'veggie' }
    ],
    tags: ['川菜']
  },
  {
    id: '8',
    name: '青椒肉丝',
    ingredients: [
      { name: '青椒', category: 'veggie' },
      { name: '猪肉', category: 'meat' }
    ],
    tags: ['家常菜']
  },
  { id: crypto.randomUUID(), name: '奥尔良鸡腿', ingredients: [{ name: '鸡腿', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '煎鸡胸肉', ingredients: [{ name: '鸡胸肉', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '泡椒鸡胗', ingredients: [{ name: '鸡胗', category: 'meat' }, { name: '泡椒', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '芸豆炒鸡蛋', ingredients: [{ name: '芸豆', category: 'veggie' }, { name: '鸡蛋', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '清炒芸豆', ingredients: [{ name: '芸豆', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '清炒四季豆', ingredients: [{ name: '四季豆', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '炒土豆丝', ingredients: [{ name: '土豆', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '白灼菜心', ingredients: [{ name: '菜心', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '蒜蓉菠菜', ingredients: [{ name: '菠菜', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '西兰花', ingredients: [{ name: '西兰花', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '西葫芦炒肉', ingredients: [{ name: '西葫芦', category: 'veggie' }, { name: '猪肉', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '胡萝卜丝炒肉', ingredients: [{ name: '胡萝卜', category: 'veggie' }, { name: '猪肉', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '蒜苔炒肉', ingredients: [{ name: '蒜苔', category: 'veggie' }, { name: '猪肉', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '辣椒炒肉（螺丝椒）', ingredients: [{ name: '螺丝椒', category: 'veggie' }, { name: '猪肉', category: 'meat' }], tags: [] },
  { id: crypto.randomUUID(), name: '白灼生菜', ingredients: [{ name: '生菜', category: 'veggie' }], tags: [] },
  { id: crypto.randomUUID(), name: '土豆丝炒肉', ingredients: [{ name: '土豆', category: 'veggie' }, { name: '猪肉', category: 'meat' }], tags: [] }
];
