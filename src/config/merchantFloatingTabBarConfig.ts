/**
 * Merchant floating tab bar — icon map and resolution (max 3 tabs per Figma 77237).
 */
import type { MerchantFTabBarItem } from '../components/MerchantFTabBar'
import { design } from '../lib/figmaDesignAssets'

export const MERCHANT_FLOATING_TAB_BAR_MAX_ITEMS = 3 as const

const mft = design.merchantFloatingTabBar

export const MERCHANT_FLOATING_TAB_BAR_ICON_SRC = {
  venue: mft.venue,
  isles: mft.isles,
  list: mft.list,
} as const

export type MerchantFloatingTabBarIconKey = keyof typeof MERCHANT_FLOATING_TAB_BAR_ICON_SRC

export type MerchantFloatingTabBarItemConfig = {
  id: string
  label: string
  icon: MerchantFloatingTabBarIconKey
}

export type MerchantFloatingTabBarResolved = {
  barItems: MerchantFTabBarItem[]
}

function toBarItem(def: MerchantFloatingTabBarItemConfig): MerchantFTabBarItem {
  const { default: iconSrcDefault, selected: iconSrcSelected } = MERCHANT_FLOATING_TAB_BAR_ICON_SRC[def.icon]
  return {
    id: def.id,
    label: def.label,
    iconSrcDefault,
    iconSrcSelected,
  }
}

export function resolveMerchantFloatingTabBarModel(
  items: readonly MerchantFloatingTabBarItemConfig[],
): MerchantFloatingTabBarResolved {
  const slice = items.slice(0, MERCHANT_FLOATING_TAB_BAR_MAX_ITEMS)
  return { barItems: slice.map((def) => toBarItem(def)) }
}

export const MERCHANT_TAB_SEARCH_ICON = mft.search
