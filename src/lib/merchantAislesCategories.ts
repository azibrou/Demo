import { design } from './figmaDesignAssets'

export type MerchantAislesCategory = {
  id: string
  label: string
  emoji: string
  imageSrc: string
}

const CATEGORY_META: { label: string; emoji: string }[] = [
  { label: 'Breakfast', emoji: '🥐' },
  { label: 'Fresh & ready', emoji: '🥗' },
  { label: 'Bakery', emoji: '🍞' },
  { label: 'Fruits & vegetables', emoji: '🥕' },
  { label: 'Dairy & eggs', emoji: '🥛' },
  { label: 'Cheese', emoji: '🧀' },
  { label: 'Meat & fish', emoji: '🍗' },
  { label: 'Vegan', emoji: '🌱' },
  { label: 'Beverages', emoji: '🥤' },
  { label: 'Energy drinks', emoji: '⚡' },
  { label: 'Water & flavoured water', emoji: '💧' },
  { label: 'Coffee, tea & cocoa', emoji: '☕' },
  { label: 'Salty snacks', emoji: '🥨' },
  { label: 'Sweet snacks', emoji: '🍫' },
  { label: 'Ice cream', emoji: '🍦' },
  { label: 'Frozen products', emoji: '❄️' },
  { label: 'Bio & special nutrition', emoji: '🌿' },
  { label: 'Instant meals', emoji: '🍜' },
  { label: 'Sports nutrition', emoji: '💪' },
  { label: 'Pantry', emoji: '🫙' },
  { label: 'Canned goods & preserves', emoji: '🥫' },
  { label: 'Health & wellbeing', emoji: '💊' },
  { label: 'International cuisine', emoji: '🌍' },
  { label: 'Home care', emoji: '🧹' },
  { label: 'Home accessories', emoji: '🏠' },
  { label: 'Personal care', emoji: '🧴' },
  { label: 'Baby care', emoji: '👶' },
  { label: 'Pet care', emoji: '🐾' },
  { label: 'Beer and cider', emoji: '🍺' },
  { label: 'Wine', emoji: '🍷' },
]

function labelToId(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Aisles grid categories — Figma 77940:95171; shared with {@link CategoryScreen}. */
export const MERCHANT_AISLES_CATEGORIES: readonly MerchantAislesCategory[] = CATEGORY_META.map(
  (meta, i) => ({
    id: labelToId(meta.label),
    label: meta.label,
    emoji: meta.emoji,
    imageSrc: design.aisles.categoryTiles[i]!,
  }),
)

const SUBCATEGORIES: Record<string, readonly string[]> = {
  breakfast: ['Cereals', 'Spreads', 'Yogurt', 'Eggs', 'Pastries'],
  'fresh-and-ready': ['Salads', 'Sandwiches', 'Ready meals', 'Sushi'],
  bakery: ['Bread', 'Pastries', 'Cakes', 'Crispbread'],
  'fruits-and-vegetables': ['Fruit', 'Vegetables', 'Berries', 'Herbs'],
  'dairy-and-eggs': ['Milk', 'Eggs', 'Yogurt & Pudding', 'Curd', 'Butter', 'Sour cream'],
  cheese: ['Sliced', 'Hard cheese', 'Soft cheese', 'Snacks'],
  'meat-and-fish': ['Chicken', 'Pork', 'Beef', 'Fish', 'Seafood'],
  vegan: ['Plant milk', 'Meat alternatives', 'Snacks'],
  beverages: ['Juice', 'Soft drinks', 'Water'],
  'energy-drinks': ['Energy drinks', 'Sports drinks'],
  'water-and-flavoured-water': ['Still water', 'Sparkling', 'Flavoured'],
  'coffee-tea-and-cocoa': ['Coffee', 'Tea', 'Cocoa'],
  'salty-snacks': ['Chips', 'Nuts', 'Crackers'],
  'sweet-snacks': ['Chocolate', 'Biscuits', 'Candy'],
  'ice-cream': ['Tubs', 'Sticks', 'Sorbet'],
  'frozen-products': ['Vegetables', 'Meals', 'Desserts'],
  'bio-and-special-nutrition': ['Gluten free', 'Lactose free', 'Organic'],
  'instant-meals': ['Noodles', 'Soups', 'Rice'],
  'sports-nutrition': ['Protein', 'Bars', 'Drinks'],
  pantry: ['Pasta', 'Rice', 'Sauces'],
  'canned-goods-and-preserves': ['Vegetables', 'Fish', 'Fruit'],
  'health-and-wellbeing': ['Vitamins', 'Supplements'],
  'international-cuisine': ['Asian', 'Mexican', 'Italian'],
  'home-care': ['Cleaning', 'Laundry'],
  'home-accessories': ['Kitchen', 'Storage'],
  'personal-care': ['Shower', 'Oral care', 'Skincare'],
  'baby-care': ['Food', 'Diapers', 'Wipes'],
  'pet-care': ['Dog', 'Cat'],
  'beer-and-cider': ['Beer', 'Cider'],
  wine: ['Red', 'White', 'Rosé'],
}

export function merchantAislesSubcategories(categoryId: string): readonly string[] {
  return SUBCATEGORIES[categoryId] ?? ['All']
}

export function findMerchantAislesCategory(categoryId: string): MerchantAislesCategory | undefined {
  return MERCHANT_AISLES_CATEGORIES.find((c) => c.id === categoryId)
}
