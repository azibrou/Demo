/**
 * Cross-merchant assortment search for the home search screen.
 *
 * Beyond the featured Bolt Market store, generic queries also surface matching
 * dishes from every restaurant merchant's real (scraped) assortment, so the
 * results list mirrors live Bolt Food where one query spans many providers.
 */

import { boltFoodAssets as a } from './boltFoodAssets'
import { IL_FORNO_NAME, ilFornoCover } from './ilFornoMerchantContent'
import {
  AMALFI_NAME,
  AMIJAMI_NAME,
  DAMAK_NAME,
  HESBURGER_NAME,
  KOLM_TILLI_NAME,
  NIKOLAY_NAME,
  POKE_BOWL_KRISTIINE_NAME,
  SHAURMA_NAME,
  TOMMI_GRILL_NAME,
} from './multiRestaurantContent'
import { resolveRestaurantContent, restaurantAssortment } from './restaurantMerchantContent'
import type { BoltSearchDish, BoltSearchProvider } from './boltFoodTallinnSearchData'

type MerchantMeta = {
  name: string
  imageSrc: string
  deliveryFee: string
  eta: string
  rating: string
  ratingCount: string
}

/**
 * Provider metadata for each searchable restaurant — covers, ETAs and ratings
 * mirror the home carousels in `boltFoodTallinnHomeContent.ts`. Assortments are
 * resolved on demand via `resolveRestaurantContent(name)`.
 */
const RESTAURANT_MERCHANTS: readonly MerchantMeta[] = [
  { name: IL_FORNO_NAME, imageSrc: ilFornoCover, deliveryFee: '1,90 €', eta: '20–25 min', rating: '4.7', ratingCount: '500+' },
  { name: AMIJAMI_NAME, imageSrc: a.amijamiSushiKadriorg, deliveryFee: '1,90 €', eta: '25–35 min', rating: '4.7', ratingCount: '500+' },
  { name: DAMAK_NAME, imageSrc: a.damakDonerKebab, deliveryFee: '1,90 €', eta: '15–20 min', rating: '4.6', ratingCount: '300+' },
  { name: POKE_BOWL_KRISTIINE_NAME, imageSrc: a.littleJapanKesklinn, deliveryFee: '1,90 €', eta: '40–45 min', rating: '4.6', ratingCount: '200+' },
  { name: NIKOLAY_NAME, imageSrc: a.nikolayBarBuffee, deliveryFee: '1,90 €', eta: '20–25 min', rating: '4.7', ratingCount: '300+' },
  { name: AMALFI_NAME, imageSrc: a.amalfiRistorantePizzeria, deliveryFee: '1,90 €', eta: '10–15 min', rating: '4.6', ratingCount: '180' },
  { name: SHAURMA_NAME, imageSrc: a.shaurmaKebabViruKeskus, deliveryFee: '1,90 €', eta: '10–15 min', rating: '4.5', ratingCount: '500+' },
  { name: KOLM_TILLI_NAME, imageSrc: a.kolmTilliTallinn, deliveryFee: '1,90 €', eta: '15–25 min', rating: '4.6', ratingCount: '210' },
  { name: HESBURGER_NAME, imageSrc: a.hesburgerViruTanav, deliveryFee: '1,90 €', eta: '15–25 min', rating: '4.5', ratingCount: '500+' },
  { name: TOMMI_GRILL_NAME, imageSrc: a.tommiGrillMetro, deliveryFee: '1,90 €', eta: '15–25 min', rating: '4.5', ratingCount: '500+' },
]

/** Estonian → English so "banaan" matches "banana" (mirrors boltMarketSearch). */
function normalize(value: string): string {
  return value.toLowerCase().replace(/banaan/g, 'banana')
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Restaurant providers whose assortment matches `query`, each carrying up to
 * `maxItemsPerMerchant` matching dishes (deduped by item id).
 */
export function searchRestaurantMerchants(query: string, maxItemsPerMerchant = 12): BoltSearchProvider[] {
  const q = normalize(query.trim())
  if (!q) return []

  const providers: BoltSearchProvider[] = []
  for (const merchant of RESTAURANT_MERCHANTS) {
    const content = resolveRestaurantContent(merchant.name)
    const seen = new Set<string>()
    const items: BoltSearchDish[] = []
    for (const item of restaurantAssortment(content)) {
      if (!normalize(item.title).includes(q)) continue
      if (seen.has(item.itemId)) continue
      seen.add(item.itemId)
      items.push({
        id: item.itemId,
        name: item.title,
        price: item.price ?? '',
        imageSrc: item.imageSrc,
      })
      if (items.length >= maxItemsPerMerchant) break
    }
    if (items.length === 0) continue
    providers.push({
      id: `rest-${slug(merchant.name)}`,
      name: merchant.name,
      imageSrc: merchant.imageSrc,
      deliveryFee: merchant.deliveryFee,
      eta: merchant.eta,
      rating: merchant.rating,
      ratingCount: merchant.ratingCount,
      scheduled: false,
      kind: 'restaurant',
      items,
    })
  }
  return providers
}
