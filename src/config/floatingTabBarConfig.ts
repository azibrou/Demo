/**
 * Floating tab bar **logic** only (limits, More slot, icon map, resolution).
 * Item lists live with each screen — e.g. `homeFloatingTabBarItems.ts` — not here.
 */
import type { FloatingTabBarItem } from '../components/FloatingTabBar'
import { design } from '../lib/figmaDesignAssets'

/** Visible slots in the bar (Figma). Beyond this, the last slot is “More”. */
export const FLOATING_TAB_BAR_MAX_ITEMS = 4 as const

/** Synthetic id for the overflow entry tab. */
export const FLOATING_TAB_BAR_MORE_ITEM_ID = '__floating_tab_more__'

export const FLOATING_TAB_BAR_MORE_LABEL = 'More'

const ft = design.floatingTabBar

/** Icon assets — default vs selected (Figma 76290 tab icons + stores overflow). */
export const FLOATING_TAB_BAR_ICON_SRC = {
  store: ft.store,
  categories: ft.categories,
  search: ft.search,
  more: ft.more,
  home: ft.home,
  dineout: ft.dineout,
  list: ft.list,
} as const

export type FloatingTabBarIconKey = keyof typeof FLOATING_TAB_BAR_ICON_SRC

export type FloatingTabBarItemConfig = {
  id: string
  label: string
  icon: FloatingTabBarIconKey
}

export type FloatingTabBarResolved = {
  /** Items to pass to `FloatingTabBar` (length 0…4). */
  barItems: FloatingTabBarItem[]
  /** Logical items hidden behind “More” (empty if no overflow). */
  overflowItems: FloatingTabBarItemConfig[]
  /** When non-empty, {@link FLOATING_TAB_BAR_MORE_ITEM_ID} is the 4th tab. */
  moreItemId: typeof FLOATING_TAB_BAR_MORE_ITEM_ID
}

function toBarItem(def: FloatingTabBarItemConfig): FloatingTabBarItem {
  const { default: iconSrcDefault, selected: iconSrcSelected } = FLOATING_TAB_BAR_ICON_SRC[def.icon]
  return {
    id: def.id,
    label: def.label,
    iconSrcDefault,
    iconSrcSelected,
  }
}

/**
 * Turn a screen-supplied item list into `FloatingTabBar` props (from a screen module, not this file).
 *
 * - Up to **4** items render as normal tabs.
 * - If **more than 4** logical items are listed, only the first **3** render plus
 *   a 4th tab labeled {@link FLOATING_TAB_BAR_MORE_LABEL} using the **more** icon;
 *   remaining items are returned as `overflowItems` for the screen to handle (e.g. sheet).
 */
export function resolveFloatingTabBarModel(items: readonly FloatingTabBarItemConfig[]): FloatingTabBarResolved {
  const moreItemId = FLOATING_TAB_BAR_MORE_ITEM_ID

  if (items.length === 0) {
    return { barItems: [], overflowItems: [], moreItemId }
  }

  if (items.length <= FLOATING_TAB_BAR_MAX_ITEMS) {
    return {
      barItems: items.map((def) => toBarItem(def)),
      overflowItems: [],
      moreItemId,
    }
  }

  const primaryDefs = items.slice(0, FLOATING_TAB_BAR_MAX_ITEMS - 1)
  const overflowDefs = items.slice(FLOATING_TAB_BAR_MAX_ITEMS - 1)

  const moreIcons = FLOATING_TAB_BAR_ICON_SRC.more
  return {
    barItems: [
      ...primaryDefs.map((def) => toBarItem(def)),
      {
        id: moreItemId,
        label: FLOATING_TAB_BAR_MORE_LABEL,
        iconSrcDefault: moreIcons.default,
        iconSrcSelected: moreIcons.selected,
      },
    ],
    overflowItems: overflowDefs,
    moreItemId,
  }
}
