import { design } from './figmaDesignAssets'

const dn = design.dineOutTopNav

export type DineOutFilterChip = {
  id: string
  label: string
  iconSrc?: string
  chevron?: boolean
  accent?: boolean
}

/** DineOut filter row — Figma 77937:93135. */
export const dineOutFilterChips: readonly DineOutFilterChip[] = [
  { id: 'offers', label: 'Offers', iconSrc: dn.offerOutline },
  { id: 'rating', label: 'Rating', iconSrc: dn.ratingSelected, chevron: true },
  { id: 'delivery-fee', label: 'Delivery fee', iconSrc: dn.bikeDeliveryOutline, chevron: true },
  { id: 'delivery-time', label: 'Delivery time', iconSrc: dn.timerOutline, chevron: true },
  { id: 'pick-up', label: 'Pick up', iconSrc: dn.walk },
  { id: 'schedule', label: 'Schedule', iconSrc: dn.calendarOutline },
  { id: 'bolt-plus', label: 'Bolt Plus', iconSrc: dn.boltPlusOutline },
  { id: 'categories', label: 'Categories', chevron: true },
  { id: 'all-filters', label: 'All filters', accent: true },
] as const
