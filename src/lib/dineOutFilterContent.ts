import { design } from './figmaDesignAssets'

const tm = design.thumbnailM

export type DineOutFilterChip = {
  id: string
  label: string
  iconSrc?: string
  chevron?: boolean
  accent?: boolean
}

/** DineOut filter row — Figma 77303:221011. */
export const dineOutFilterChips: readonly DineOutFilterChip[] = [
  { id: 'offers', label: 'Offers' },
  { id: 'rating', label: 'Rating', iconSrc: tm.ratingStar, chevron: true },
  { id: 'delivery-fee', label: 'Delivery fee', iconSrc: tm.bikeDelivery, chevron: true },
  { id: 'delivery-time', label: 'Delivery time', iconSrc: tm.timer, chevron: true },
  { id: 'pick-up', label: 'Pick up' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'bolt-plus', label: 'Bolt Plus' },
  { id: 'categories', label: 'Categories', chevron: true },
  { id: 'all-filters', label: 'All filters', accent: true },
] as const
