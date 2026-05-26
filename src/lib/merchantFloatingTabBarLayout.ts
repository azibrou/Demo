/** Merchant tab bar layout snippets — height + slot phases. RTL expand: wideBasketFabExpand.ts */

export {
  MERCHANT_TAB_BAR_ROW_HEIGHT_PX,
  MERCHANT_TAB_BAR_PILL_HEIGHT_PX,
  WIDE_BASKET_FAB_SIZE_PX,
  TAB_ACTION_SIZE_PX,
  wideBasketFabInTabBarAnchorCssMustInclude as wideBasketFabInTabBarCssMustInclude,
  wideBasketFabRtlForbiddenInTabBarRule as wideBasketFabInTabBarCssMustNotInclude,
} from './wideBasketFabExpand'

export const merchantTabBarHeightCssMustInclude = [
  '.floating-tab-bar__row {',
  'min-height: 56px;',
  'height: 56px;',
  '.merchant-ftb__row--basket .floating-tab-bar__pill {',
  'height: 56px;',
  'min-height: 56px;',
  'max-height: 56px;',
] as const

/** Loading slot opens to 56px — pill flex-1 shrinks in sync (150ms). */
export const merchantBasketSlotLoadingCssMustInclude = [
  ".merchant-ftb__row--basket[data-basket-phase='loading'] .floating-tab-bar__basket-slot--wide",
  'flex: 0 0 56px;',
] as const

export const merchantBasketSlotDefaultCssMustInclude = [
  ".merchant-ftb__row--basket[data-basket-phase='default'] .floating-tab-bar__basket-slot--wide {",
  'flex: 1 1 0;',
] as const

export const wideBasketFabLoadingCssMustInclude = [
  ".wide-basket-fab[data-state='loading'] .wide-basket-fab__loader {",
  'opacity: 1;',
  ".wide-basket-fab[data-state='loading'] .wide-basket-fab__icon,",
  'opacity: 0;',
  'pointer-events: none;',
] as const
