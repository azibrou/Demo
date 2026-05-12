import type { FloatingTabBarItemConfig } from '../config/floatingTabBarConfig'

/** Bottom tabs for the home + stores + shopping list stack (`HomeShoppingStackLayout`). */
export const HOME_SHOPPING_STACK_FLOATING_TAB_BAR_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'store', label: 'Stores', icon: 'store' },
  { id: 'dineout', label: 'DineOut', icon: 'dineout' },
  { id: 'search', label: 'Search', icon: 'search' },
] as const satisfies readonly FloatingTabBarItemConfig[]
