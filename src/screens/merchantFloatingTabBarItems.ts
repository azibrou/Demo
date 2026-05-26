import type { MerchantFloatingTabBarItemConfig } from '../config/merchantFloatingTabBarConfig'

/** Tab bar entries for merchant screens — Figma 77237:148679. */
export const MERCHANT_FLOATING_TAB_BAR_ITEMS = [
  { id: 'venue', label: 'Venue', icon: 'venue' },
  { id: 'isles', label: 'Aisles', icon: 'isles' },
  { id: 'list', label: 'List', icon: 'list' },
] as const satisfies readonly MerchantFloatingTabBarItemConfig[]
