import type { FloatingTabBarItemConfig } from '../config/floatingTabBarConfig'

/** Tab bar for [Eater] Home — Figma 76281:68555. */
export const HOME_FLOATING_TAB_BAR_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'store', label: 'Store', icon: 'store' },
  { id: 'dineout', label: 'DineOut', icon: 'dineout' },
] as const satisfies readonly FloatingTabBarItemConfig[]
