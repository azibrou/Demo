import type { WideBasketFabState } from '../components/WideBasketFab'

/** Ignore sub-pixel scroll noise when detecting movement. */
export const MERCHANT_SCROLL_COMPACT_DELTA_PX = 1

/** Merchant page vertical scroll container (see styles.css `.merchant-screen`). */
export function getMerchantScrollEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.querySelector<HTMLElement>('.merchant-screen')
}

/** True when the merchant screen is not at the top (e.g. after basket enter while scrolled). */
export function isMerchantScrollPastExpandTop(scrollTop: number): boolean {
  return scrollTop > 0
}

/**
 * Scroll-driven merchant tab/basket layout — one-way latch until the user expands tabs.
 * - Expanded: full tab pill + 56px basket (`scrollCompact` false).
 * - Compact: solo tab + wide basket (`scrollCompact` true).
 * Scrolling up/down while compact does not re-expand; only {@link expandMerchantTabs} resets.
 */
export function resolveMerchantScrollCompact(
  scrollTop: number,
  prevScrollTop: number,
  scrollCompact: boolean,
): boolean {
  if (scrollCompact) return true
  return Math.abs(scrollTop - prevScrollTop) >= MERCHANT_SCROLL_COMPACT_DELTA_PX
}

export function merchantScrollCompactToTabSolo(scrollCompact: boolean): boolean {
  return scrollCompact
}

export function merchantScrollCompactToFabPhase(scrollCompact: boolean): WideBasketFabState {
  return scrollCompact ? 'default' : 'collapsed'
}
