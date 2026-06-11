import boltMarketMenu from './boltMarketMenu.json'
import searchData from './boltFoodTallinnSearchData.json'
import { boltMarketCategoryCatalog } from './boltMarketCategoryContent'

/** A searchable Bolt Market product. */
export type BoltMarketProduct = {
  id: string
  title: string
  price: string
  imageSrc?: string
}

function boltImage(rel: string | null | undefined): string | undefined {
  if (!rel) return undefined
  return `${import.meta.env.BASE_URL}bolt/${rel}`
}

/** Estonian → English so "banaan" matches "banana". */
function normalize(value: string): string {
  return value.toLowerCase().replace(/banaan/g, 'banana')
}

/** Scraped store assortment (one preview product per category). */
const previewProducts: BoltMarketProduct[] = boltMarketMenu.sections.flatMap((section) =>
  section.items.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    imageSrc: boltImage(item.imageSrc),
  })),
)

type SearchSnapshot = {
  providers?: { items?: { name?: string; price?: string; imageSrc?: string }[] }[]
}

/** Real "banana" search results captured earlier (`npm run bolt:search:sync`). */
const bananaProducts: BoltMarketProduct[] = (() => {
  const snapshot = (searchData as Record<string, SearchSnapshot>).banana
  const items = (snapshot?.providers ?? []).flatMap((provider) => provider.items ?? [])
  const seen = new Set<string>()
  const out: BoltMarketProduct[] = []
  items.forEach((item, index) => {
    const title = item.name ?? ''
    if (!/banana|banaan/i.test(title)) return
    if (seen.has(title)) return
    seen.add(title)
    out.push({
      id: `bm-banana-${index}`,
      title,
      price: item.price ?? '',
      imageSrc: boltImage(item.imageSrc),
    })
  })
  return out
})()

/** De-duplicate by product title (preview rows repeat the richer category items). */
function dedupeByTitle(products: BoltMarketProduct[]): BoltMarketProduct[] {
  const seen = new Set<string>()
  const out: BoltMarketProduct[] = []
  for (const product of products) {
    const key = product.title.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(product)
  }
  return out
}

export const boltMarketProducts: BoltMarketProduct[] = dedupeByTitle([
  ...boltMarketCategoryCatalog,
  ...bananaProducts,
  ...previewProducts,
])

/** Category titles (with emoji) for the empty-state suggestions. */
export const boltMarketCategoryTitles: string[] = boltMarketMenu.sections.map((s) => s.title)

/** Empty-state suggestion rows (Figma 80678:185740). */
export const boltMarketSuggestions: string[] = [
  'Order again',
  'Most popular',
  ...boltMarketCategoryTitles,
]

export function searchBoltMarket(query: string): BoltMarketProduct[] {
  const q = normalize(query.trim())
  if (q.length === 0) return []
  return boltMarketProducts.filter((product) => normalize(product.title).includes(q))
}

/** Query-completion labels shown above results while typing (Figma 80678:184283). */
export function boltMarketQuerySuggestions(query: string, limit = 3): string[] {
  const q = normalize(query.trim())
  if (q.length === 0) return []
  const labels = boltMarketCategoryTitles.map((t) => t.replace(/^[^\p{L}]+/u, '').trim())
  return labels.filter((label) => normalize(label).includes(q)).slice(0, limit)
}
