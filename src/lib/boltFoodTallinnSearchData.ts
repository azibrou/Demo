import searchData from './boltFoodTallinnSearchData.json'
import type { HomeSearchTab } from './homeSearchContent'
import { boltFoodAssets } from './boltFoodAssets'
import { searchBoltMarket } from './boltMarketSearch'
import { searchRestaurantMerchants } from './homeSearchMerchants'
import {
  parseEtaText,
  type RestaurantMerchantNavState,
  type StoreMerchantNavState,
} from './merchantNavigation'
import {
  restaurantOrderProviderRef,
  storeOrderProviderRef,
  type OrderProviderRef,
} from './orderProvider'

export type BoltSearchDish = {
  id: string
  name: string
  price: string
  imageSrc?: string
}

export type BoltSearchProviderKind = 'restaurant' | 'store'

export type BoltSearchProvider = {
  id: string
  name: string
  imageSrc?: string
  deliveryFee: string
  eta: string
  rating: string
  ratingCount: string
  scheduled: boolean
  items: BoltSearchDish[]
  kind?: BoltSearchProviderKind
}

export type BoltSearchSnapshot = {
  query: string
  categoryLabel: string
  resultCount: number
  providers: BoltSearchProvider[]
}

const PREFIXES = ['b', 'ba', 'ban', 'bana', 'banan', 'banana'] as const
export type BoltSearchPrefix = (typeof PREFIXES)[number]

/** Featured store — pinned first in search result lists. */
const BOLT_MARKET_TOOMPUIESTEE_ID = '28032'

const data = searchData as Record<string, BoltSearchSnapshot>

function boltSearchPath(rel?: string): string {
  if (!rel) return ''
  const base = import.meta.env.BASE_URL
  return `${base}bolt/${rel}`
}

function prioritizeBoltMarketToompuiestee(providers: BoltSearchProvider[]): BoltSearchProvider[] {
  const index = providers.findIndex((provider) => provider.id === BOLT_MARKET_TOOMPUIESTEE_ID)
  if (index <= 0) return providers
  return [providers[index], ...providers.slice(0, index), ...providers.slice(index + 1)]
}

/** Bolt Market entries are stores; everything else is treated as a restaurant. */
export function inferBoltSearchProviderKind(provider: Pick<BoltSearchProvider, 'name' | 'kind'>): BoltSearchProviderKind {
  if (provider.kind) return provider.kind
  return /^Bolt Market\b/i.test(provider.name) ? 'store' : 'restaurant'
}

export function filterBoltSearchProvidersByTab(
  providers: BoltSearchProvider[],
  tab: HomeSearchTab,
): BoltSearchProvider[] {
  if (tab === 'All') return providers
  const kind: BoltSearchProviderKind = tab === 'Stores' ? 'store' : 'restaurant'
  return providers.filter((provider) => inferBoltSearchProviderKind(provider) === kind)
}

export function filterBoltSearchSnapshotByTab(
  snapshot: BoltSearchSnapshot,
  tab: HomeSearchTab,
): BoltSearchSnapshot {
  const providers = filterBoltSearchProvidersByTab(snapshot.providers, tab)
  return {
    ...snapshot,
    providers,
    resultCount: providers.length,
  }
}

/** Synthetic Bolt Market store result built from the local product catalog. */
function boltMarketStoreProvider(query: string): BoltSearchProvider | null {
  const matches = searchBoltMarket(query)
  if (matches.length === 0) return null
  return {
    id: BOLT_MARKET_TOOMPUIESTEE_ID,
    name: 'Bolt Market Toompuiestee',
    imageSrc: boltFoodAssets.boltMarketToompuiestee,
    deliveryFee: '1,90 €',
    eta: '15 min',
    rating: '4.9',
    ratingCount: '500+',
    scheduled: false,
    kind: 'store',
    items: matches.slice(0, 12).map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      imageSrc: product.imageSrc,
    })),
  }
}

/**
 * Local result set for free-text queries: the featured Bolt Market store plus
 * matching assortment from every restaurant merchant (mirrors live Bolt Food,
 * where one query spans many providers).
 */
function localMerchantSnapshot(query: string): BoltSearchSnapshot | null {
  const storeProvider = boltMarketStoreProvider(query)
  const restaurantProviders = searchRestaurantMerchants(query)
  const providers = [...(storeProvider ? [storeProvider] : []), ...restaurantProviders]
  if (providers.length === 0) return null
  return {
    query,
    categoryLabel: query,
    resultCount: providers.length,
    providers: prioritizeBoltMarketToompuiestee(providers),
  }
}

/** Longest matching snapshot for the current query (progressive typing). */
export function getBoltSearchSnapshot(query: string): BoltSearchSnapshot | null {
  const q = query.trim().toLowerCase()
  if (!q) return null
  const match = [...PREFIXES].reverse().find((prefix) => q === prefix || q.startsWith(prefix))
  if (match && data[match]) {
    const snap = data[match]
    return {
      ...snap,
      query: q,
      categoryLabel: `🍌 ${q}`,
      providers: prioritizeBoltMarketToompuiestee(
        snap.providers.map((p) => ({
          ...p,
          imageSrc: p.imageSrc ? boltSearchPath(p.imageSrc) : undefined,
          items: p.items.map((item) => ({
            ...item,
            imageSrc: item.imageSrc ? boltSearchPath(item.imageSrc) : undefined,
          })),
        })),
      ),
    }
  }
  // Other queries — search the local Bolt Market catalog + restaurant assortments.
  return localMerchantSnapshot(q)
}

export function formatBoltSearchResultCount(count: number): string {
  return count === 1 ? '1 result' : `${count} results`
}

/** Nav state that re-opens the merchant behind a search result (matches store/restaurant nav shapes). */
export function boltSearchProviderNavState(
  provider: BoltSearchProvider,
): StoreMerchantNavState | RestaurantMerchantNavState {
  const { eta, etaLabel } = parseEtaText(provider.eta)
  if (inferBoltSearchProviderKind(provider) === 'store') {
    return {
      kind: 'store',
      name: provider.name,
      heroImageSrc: provider.imageSrc ?? '',
      logoImageSrc: provider.imageSrc ?? '',
      rating: provider.rating,
      reviews: provider.ratingCount,
      deliveryPrice: provider.deliveryFee,
      deliveryLabel: 'delivery',
      eta,
      etaLabel,
    }
  }
  return {
    kind: 'restaurant',
    name: provider.name,
    heroImageSrc: provider.imageSrc ?? '',
    rating: provider.rating,
    reviews: provider.ratingCount,
    deliveryPrice: provider.deliveryFee,
    deliveryLabel: 'delivery',
    eta,
    etaLabel,
  }
}

/**
 * Order-provider ref for a search result so quick-adds attribute to the result's own merchant.
 * This lets the cross-merchant "Start a new order?" flow fire when adding across providers.
 */
export function boltSearchOrderProviderRef(provider: BoltSearchProvider): OrderProviderRef {
  const navState = boltSearchProviderNavState(provider)
  return navState.kind === 'store'
    ? storeOrderProviderRef(navState)
    : restaurantOrderProviderRef(navState)
}
