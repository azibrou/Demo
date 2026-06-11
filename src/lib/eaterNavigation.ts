/** Eater hub tabs — Home, Stores, DineOut (not inner stack routes). */
const HUB_LAST_SEGMENTS = new Set<string | undefined>([undefined, 'stores', 'dineout'])

const VENUE_LAST_SEGMENTS = new Set(['store-merchant', 'restaurant'])

const INNER_LAST_SEGMENTS = new Set([
  'category',
  'checkout',
  'shopping-list',
  'profile',
  'edit-phone',
  'store-merchant',
  'restaurant',
])

function lastSegment(pathname: string): string | undefined {
  return pathname.split('/').filter(Boolean).pop()
}

/** `/`, `/stores`, `/dineout` */
export function isEaterHubPath(pathname: string): boolean {
  return HUB_LAST_SEGMENTS.has(lastSegment(pathname))
}

/** Home tab only (`/`), not Stores or DineOut. */
export function isEaterHomeTabPath(pathname: string): boolean {
  return lastSegment(pathname) === undefined
}

export function isEaterVenuePath(pathname: string): boolean {
  const last = lastSegment(pathname)
  return last != null && VENUE_LAST_SEGMENTS.has(last)
}

export function isEaterInnerPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  if (last == null) return false
  if (INNER_LAST_SEGMENTS.has(last)) return true
  return segments[0] === 'category' && segments.length >= 2
}

/**
 * Basket clears only when:
 * - leaving an inner/venue screen back to the hub, or
 * - opening a store/restaurant from the Home tab (`/`).
 *
 * Not cleared on hub tab switches or when entering a venue from Stores/DineOut.
 */
export function shouldResetBasketOnNavigation(from: string, to: string): boolean {
  if (from === to) return false
  if (isEaterHubPath(from) && isEaterHubPath(to)) return false
  if (isEaterHubPath(to) && !isEaterHubPath(from)) return true
  if (isEaterVenuePath(to) && isEaterHomeTabPath(from)) return true
  return false
}

/** Alias for route-change listener in {@link BasketFabProvider}. */
export function shouldResetBasketOnRouteChange(prev: string, next: string): boolean {
  return shouldResetBasketOnNavigation(prev, next)
}

/** History back / slide-out — reset when leaving any non-hub screen. */
export function shouldResetBasketWhenLeavingPath(pathname: string): boolean {
  return !isEaterHubPath(pathname)
}
