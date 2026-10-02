export type Category = 'veg' | 'protein';

export interface Ingredient {
  id: string;
  name: string;
  note: string;
  cat: Category;
  time: number;
  temp: number;
  color: string;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'sweet-potato', name: 'Sweet potato', note: 'cubed, 1-inch', cat: 'veg', time: 40, temp: 400, color: 'oklch(95% 0.06 55)' },
  { id: 'beets', name: 'Beets', note: 'cubed', cat: 'veg', time: 40, temp: 400, color: 'oklch(94% 0.05 15)' },
  { id: 'butternut-squash', name: 'Butternut squash', note: 'cubed', cat: 'veg', time: 35, temp: 400, color: 'oklch(95% 0.06 60)' },
  { id: 'potatoes', name: 'Potatoes', note: 'cubed', cat: 'veg', time: 35, temp: 400, color: 'oklch(95% 0.02 80)' },
  { id: 'carrots', name: 'Carrots', note: 'cut into strips', cat: 'veg', time: 30, temp: 400, color: 'oklch(95% 0.07 50)' },
  { id: 'brussels-sprouts', name: 'Brussels sprouts', note: 'halved', cat: 'veg', time: 25, temp: 400, color: 'oklch(95% 0.05 145)' },
  { id: 'cauliflower', name: 'Cauliflower', note: 'florets', cat: 'veg', time: 25, temp: 400, color: 'oklch(97% 0.01 90)' },
  { id: 'eggplant', name: 'Eggplant', note: 'cubed', cat: 'veg', time: 25, temp: 400, color: 'oklch(93% 0.05 310)' },
  { id: 'red-onion', name: 'Red onion', note: 'wedges', cat: 'veg', time: 20, temp: 400, color: 'oklch(93% 0.05 340)' },
  { id: 'broccoli', name: 'Broccoli', note: 'florets', cat: 'veg', time: 20, temp: 400, color: 'oklch(94% 0.06 140)' },
  { id: 'bell-peppers', name: 'Bell peppers', note: 'sliced', cat: 'veg', time: 20, temp: 400, color: 'oklch(94% 0.06 25)' },
  { id: 'green-beans', name: 'Green beans', note: 'trimmed', cat: 'veg', time: 15, temp: 400, color: 'oklch(95% 0.05 135)' },
  { id: 'zucchini', name: 'Zucchini', note: 'sliced', cat: 'veg', time: 15, temp: 400, color: 'oklch(95% 0.04 130)' },
  { id: 'cherry-tomatoes', name: 'Cherry tomatoes', note: 'whole', cat: 'veg', time: 15, temp: 400, color: 'oklch(94% 0.06 20)' },
  { id: 'asparagus', name: 'Asparagus', note: 'trimmed', cat: 'veg', time: 12, temp: 400, color: 'oklch(95% 0.05 140)' },
  { id: 'parsnips', name: 'Parsnips', note: 'cubed', cat: 'veg', time: 35, temp: 400, color: 'oklch(96% 0.02 85)' },
  { id: 'turnips', name: 'Turnips', note: 'cubed', cat: 'veg', time: 30, temp: 400, color: 'oklch(95% 0.03 100)' },
  { id: 'red-cabbage', name: 'Red cabbage', note: 'wedges', cat: 'veg', time: 25, temp: 400, color: 'oklch(92% 0.06 330)' },
  { id: 'fennel', name: 'Fennel', note: 'sliced', cat: 'veg', time: 25, temp: 400, color: 'oklch(96% 0.02 120)' },
  { id: 'mushrooms', name: 'Mushrooms', note: 'halved', cat: 'veg', time: 20, temp: 400, color: 'oklch(92% 0.02 60)' },
  { id: 'corn', name: 'Corn on the cob', note: 'cut into rounds', cat: 'veg', time: 20, temp: 400, color: 'oklch(94% 0.08 95)' },
  { id: 'artichoke-hearts', name: 'Artichoke hearts', note: 'quartered', cat: 'veg', time: 20, temp: 400, color: 'oklch(94% 0.04 130)' },
  { id: 'kale', name: 'Kale', note: 'torn', cat: 'veg', time: 10, temp: 400, color: 'oklch(93% 0.05 145)' },
  { id: 'chicken-thighs', name: 'Chicken thighs', note: 'bone-in', cat: 'protein', time: 40, temp: 425, color: 'oklch(95% 0.02 70)' },
  { id: 'italian-sausage', name: 'Italian sausage', note: 'links', cat: 'protein', time: 30, temp: 400, color: 'oklch(93% 0.04 35)' },
  { id: 'chicken-breast', name: 'Chicken breast', note: 'boneless', cat: 'protein', time: 25, temp: 400, color: 'oklch(96% 0.02 40)' },
  { id: 'chicken-sausage', name: 'Chicken sausage', note: 'links', cat: 'protein', time: 25, temp: 400, color: 'oklch(95% 0.02 75)' },
  { id: 'salmon', name: 'Salmon fillet', note: '6oz', cat: 'protein', time: 15, temp: 400, color: 'oklch(94% 0.06 30)' },
  { id: 'shrimp', name: 'Shrimp', note: 'peeled', cat: 'protein', time: 9, temp: 400, color: 'oklch(94% 0.06 35)' },
  { id: 'pork-tenderloin', name: 'Pork tenderloin', note: 'sliced medallions', cat: 'protein', time: 25, temp: 400, color: 'oklch(94% 0.04 25)' },
  { id: 'flank-steak', name: 'Flank steak', note: 'sliced', cat: 'protein', time: 20, temp: 425, color: 'oklch(90% 0.04 30)' },
  { id: 'cod', name: 'Cod fillet', note: '6oz', cat: 'protein', time: 15, temp: 400, color: 'oklch(96% 0.02 40)' },
  { id: 'tofu', name: 'Tofu', note: 'cubed', cat: 'protein', time: 25, temp: 400, color: 'oklch(97% 0.01 90)' },
  { id: 'turkey-sausage', name: 'Turkey sausage', note: 'links', cat: 'protein', time: 25, temp: 400, color: 'oklch(93% 0.03 50)' },
];
