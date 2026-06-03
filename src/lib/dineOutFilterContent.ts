import type { KalepIconStem } from './kalepIcons'

export type DineOutFilterChip = {
  id: string
  label: string
  iconName?: KalepIconStem
  chevron?: boolean
  accent?: boolean
}

/** DineOut filter row — Figma 77937:93135. */
export const dineOutFilterChips: readonly DineOutFilterChip[] = [
  { id: 'offers', label: 'Offers', iconName: 'offer-outline' },
  { id: 'rating', label: 'Rating', iconName: 'rating-star-selected', chevron: true },
  { id: 'delivery-fee', label: 'Delivery fee', iconName: 'bike-delivery-outline', chevron: true },
  { id: 'delivery-time', label: 'Delivery time', iconName: 'timer-outline', chevron: true },
  { id: 'pick-up', label: 'Pick up', iconName: 'walk' },
  { id: 'schedule', label: 'Schedule', iconName: 'calendar-outline' },
  { id: 'bolt-plus', label: 'Bolt Plus', iconName: 'bolt-plus-outline' },
  { id: 'categories', label: 'Categories', chevron: true },
  { id: 'all-filters', label: 'All filters', accent: true },
] as const
