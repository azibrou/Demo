import {
  resolveRestaurantMerchantProvider,
  resolveStoreMerchantProvider,
} from './merchantNavigation'

export type OrderProviderKind = 'store' | 'restaurant'

/** Identity + re-open info for the merchant an active order belongs to. */
export type OrderProviderRef = {
  /** Stable id (`store:slug` / `restaurant:slug`) — order belongs to exactly one at a time. */
  id: string
  name: string
  kind: OrderProviderKind
  /** Route that opens this merchant (`/store-merchant` | `/restaurant`). */
  path: string
  /** `location.state` used to re-open the merchant (home basket FAB navigation). */
  navState: unknown
}

export function providerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function storeOrderProviderRef(navState: unknown): OrderProviderRef {
  const provider = resolveStoreMerchantProvider(navState)
  return {
    id: `store:${providerSlug(provider.name)}`,
    name: provider.name,
    kind: 'store',
    path: '/store-merchant',
    navState,
  }
}

export function restaurantOrderProviderRef(navState: unknown): OrderProviderRef {
  const provider = resolveRestaurantMerchantProvider(navState)
  return {
    id: `restaurant:${providerSlug(provider.name)}`,
    name: provider.name,
    kind: 'restaurant',
    path: '/restaurant',
    navState,
  }
}

/**
 * Provider id for the merchant a route renders, or `null` for hub/inner screens.
 * Used by {@link BasketFabProvider} to gate FAB visibility to the order's merchant.
 */
export function resolveScreenProviderId(pathname: string, state: unknown): string | null {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  if (last === 'store-merchant') return storeOrderProviderRef(state).id
  if (last === 'restaurant') return restaurantOrderProviderRef(state).id
  if (segments[0] === 'category') return storeOrderProviderRef(state).id
  return null
}
