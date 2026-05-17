import type { FloatingTabBarItemConfig } from '../config/floatingTabBarConfig'

/** Tab bar entries for `StoresScreen` (former home / store browse). */
export const STORES_FLOATING_TAB_BAR_ITEMS = [
  { id: 'store', label: 'Store', icon: 'store' },
  { id: 'categories', label: 'Categories', icon: 'categories' },
  { id: 'list', label: 'List', icon: 'list' },
  { id: 'search', label: 'Search', icon: 'search' },
] as const satisfies readonly FloatingTabBarItemConfig[]
