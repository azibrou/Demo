import type { KalepIconStem } from './kalepIcons'

export type HomeSearchFilterChip = {
  id: string
  label: string
  iconName?: KalepIconStem
  chevron?: boolean
  accent?: boolean
}

/** Figma 78810:116786 — Home search filter row. */
export const HOME_SEARCH_FILTER_CHIPS: readonly HomeSearchFilterChip[] = [
  { id: 'sort', label: 'Sort', iconName: 'reorder-vert', chevron: true },
  { id: 'offers', label: 'Offers', iconName: 'offer-outline' },
  { id: 'rating', label: 'Rating', iconName: 'rating-star-selected', chevron: true },
  { id: 'delivery-fee', label: 'Delivery fee', iconName: 'bike-delivery-outline', chevron: true },
  { id: 'delivery-time', label: 'Delivery time', iconName: 'timer-outline', chevron: true },
  { id: 'pickup', label: 'Pickup', iconName: 'walk' },
  { id: 'distance', label: 'Distance', iconName: 'route-outline', chevron: true },
  { id: 'schedule', label: 'Schedule', iconName: 'calendar-outline' },
  { id: 'bolt-plus', label: 'Bolt Plus', iconName: 'bolt-plus-outline' },
  { id: 'categories', label: 'Categories', chevron: true },
  { id: 'all-filters', label: 'All filters', accent: true },
] as const

export const HOME_SEARCH_HISTORY = ['Sushi', 'Kebab', 'Sii'] as const

export const HOME_SEARCH_CATEGORIES = [
  '🔥 Stores',
  '🍔 Burgers',
  '🍕 Pizza',
  '🍟 Fast food',
  '🍣 Sushi',
  '🍖 Grill',
  '🍟 Snacks',
  '🍫 Chocolate',
  '🍪 Cookies',
] as const

export const HOME_SEARCH_TABS = ['All', 'Restaurants', 'Stores'] as const

export type HomeSearchTab = (typeof HOME_SEARCH_TABS)[number]
