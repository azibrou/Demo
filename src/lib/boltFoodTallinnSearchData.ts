import searchData from './boltFoodTallinnSearchData.json'
import type { HomeSearchTab } from './homeSearchContent'

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

/** Longest matching snapshot for the current query (progressive typing). */
export function getBoltSearchSnapshot(query: string): BoltSearchSnapshot | null {
  const q = query.trim().toLowerCase()
  if (!q) return null
  const match = [...PREFIXES].reverse().find((prefix) => q === prefix || q.startsWith(prefix))
  if (!match || !data[match]) return null
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

export function formatBoltSearchResultCount(count: number): string {
  return count === 1 ? '1 result' : `${count} results`
}
