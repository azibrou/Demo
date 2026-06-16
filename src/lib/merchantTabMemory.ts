/**
 * Remembers the active merchant tab (e.g. Venue vs Aisles) per history entry so that
 * leaving the store for a category screen and pressing back restores the tab you were on.
 *
 * Keyed by the router `location.key` (stable across a back/POP to the same entry, but
 * unique for a fresh PUSH), so re-entering a store from the hub still defaults to the
 * first tab while back-navigation preserves the selection.
 */
const tabByLocationKey = new Map<string, string>()

export function getMerchantTab(locationKey: string): string | undefined {
  return tabByLocationKey.get(locationKey)
}

export function setMerchantTab(locationKey: string, tabId: string): void {
  tabByLocationKey.set(locationKey, tabId)
}
