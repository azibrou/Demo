/**
 * WideBasketFab expand contract — ALWAYS right → left (RTL).
 *
 * The right edge is pinned; width growth extends leftward.
 * Never animate FAB `width` in the tab bar — only the basket slot flex/width tweens.
 */

export const WIDE_BASKET_FAB_EXPAND_DIRECTION = 'rtl' as const
export const WIDE_BASKET_FAB_EXPAND_ANCHOR = 'right' as const
export const WIDE_BASKET_FAB_EXPAND_MS = 150

export const MERCHANT_TAB_BAR_ROW_HEIGHT_PX = 56
export const MERCHANT_TAB_BAR_PILL_HEIGHT_PX = 56
export const WIDE_BASKET_FAB_SIZE_PX = 56
export const TAB_ACTION_SIZE_PX = 56

/** DOM hooks — must stay on {@link WideBasketFab} root button. */
export const WIDE_BASKET_FAB_EXPAND_DATA_ATTRS = {
  direction: 'data-expand-direction',
  anchor: 'data-expand-anchor',
} as const

export const WIDE_BASKET_FAB_IN_TAB_BAR_CLASS = 'wide-basket-fab--in-tab-bar'

/** In-tab-bar: FAB is absolute, inset-inline-end 0, width 100% of slot (slot drives RTL tween). */
export const wideBasketFabInTabBarAnchorCssMustInclude = [
  '.floating-tab-bar__basket-slot--wide .wide-basket-fab--in-tab-bar {',
  'position: absolute !important;',
  'inset-inline-end: 0;',
  'inset-inline-start: auto !important;',
  'width: 100% !important;',
  'transition-property: padding-inline !important;',
] as const

/** Slot uses margin-inline-start:auto on default phase so width growth extends left (RTL). */
export const wideBasketFabSlotExpandCssMustInclude = [
  '.merchant-ftb__row--basket .floating-tab-bar__basket-slot--wide {',
  'flex: 0 0 0px;',
  ".merchant-ftb__row--basket[data-basket-phase='loading'] .floating-tab-bar__basket-slot--wide {",
  'flex: 0 0 56px;',
  ".merchant-ftb__row--basket[data-basket-phase='default'] .floating-tab-bar__basket-slot--wide {",
  'flex: 1 1 0;',
  'margin-inline-start: auto;',
] as const

/** Forbidden on the FAB button only — margin-inline-start:auto belongs on the SLOT. */
export const wideBasketFabRtlForbiddenInTabBarRule = [
  'margin-left: auto',
  'margin-inline-start: auto',
  'transition-property: width',
] as const

export const wideBasketFabExpandRuleSummary = [
  'WideBasketFab ALWAYS expands right → left (RTL).',
  'Basket SLOT: margin-inline-start:auto + width/flex tween — right edge pinned, grows left.',
  'In-tab-bar FAB: position:absolute; inset-inline-end:0; width:100% (fills slot).',
  'Never tween FAB width in tab bar — only slot + padding-inline.',
  'Loading/collapsed slot: flex 0 0 56px. Default slot: flex 1 1 0.',
] as const
