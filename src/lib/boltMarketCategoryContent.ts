import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import categories from './boltMarketCategories.json'

/**
 * Real Bolt Market Toompuiestee category assortments (Dairy & Eggs, Meat & Fish),
 * scraped via `npm run boltmarket:categories` → `boltMarketCategories.json` + `public/bolt/market/`.
 */
type RawItem = { id: string; title: string; price: string; imageSrc: string | null }
type RawCategory = { title: string; items: RawItem[] }

const data = categories as Record<string, RawCategory>

function boltImage(rel: string | null | undefined): string | undefined {
  if (!rel) return undefined
  return `${import.meta.env.BASE_URL}bolt/${rel}`
}

export type CategoryScreenRealProduct = CarouselGridItemProps & { id: string }

function toProduct(item: RawItem): CategoryScreenRealProduct {
  return {
    id: item.id,
    variant: 'default',
    imageSrc: boltImage(item.imageSrc),
    title: item.title,
    price: item.price,
  }
}

/** Whether a category id has a real scraped assortment. */
export function hasBoltMarketCategory(categoryId: string): boolean {
  return data[categoryId] != null
}

function matchesSubcategory(title: string, subcategoryLabel: string): boolean {
  const t = title.toLowerCase()
  const full = subcategoryLabel.toLowerCase().trim()
  if (full.length === 0 || t.includes(full)) return true
  const firstWord = full.split(/[^a-z]+/).find(Boolean)
  return firstWord ? t.includes(firstWord) : false
}

/**
 * Real products for a category, optionally narrowed by the active subcategory label.
 * Falls back to the full category list when the subcategory yields nothing.
 */
export function resolveBoltMarketCategoryProducts(
  categoryId: string,
  subcategoryLabel: string,
): CategoryScreenRealProduct[] | null {
  const category = data[categoryId]
  if (!category) return null
  const all = category.items.map(toProduct)
  const filtered = all.filter((p) => matchesSubcategory(p.title ?? '', subcategoryLabel))
  return filtered.length > 0 ? filtered : all
}

/** Flat catalog of all scraped category products (for search). */
export const boltMarketCategoryCatalog: { id: string; title: string; price: string; imageSrc?: string }[] =
  Object.values(data).flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      imageSrc: boltImage(item.imageSrc),
    })),
  )
