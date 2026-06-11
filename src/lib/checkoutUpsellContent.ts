import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import type { SimpleItemProps } from '../components/SimpleItem'
import { resolveBoltMarketCategoryProducts } from './boltMarketCategoryContent'
import type { OrderProviderRef } from './orderProvider'
import { resolveRestaurantContent } from './restaurantMerchantContent'
import { storeMerchantCarousels } from './storeMerchantContent'

const MAX_UPSELL = 10

export type CheckoutUpsellProduct = CarouselGridItemProps & { id: string }

function menuItemToGrid(item: SimpleItemProps & { id: string }): CheckoutUpsellProduct {
  if (item.priceWas) {
    return {
      id: item.id,
      variant: 'discount',
      title: item.title,
      imageSrc: item.imageSrc,
      priceNow: item.price,
      priceWas: item.priceWas,
    }
  }

  return {
    id: item.id,
    variant: 'default',
    title: item.title,
    price: item.price,
    imageSrc: item.imageSrc,
  }
}

function restaurantUpsell(provider: OrderProviderRef, inCart: Set<string>): CheckoutUpsellProduct[] {
  const content = resolveRestaurantContent(provider.name)
  const seen = new Set<string>()
  const products: CheckoutUpsellProduct[] = []

  const candidates = [content.featured, ...content.sections.flatMap((section) => section.items)]

  for (const item of candidates) {
    if (seen.has(item.id) || inCart.has(item.id)) continue
    seen.add(item.id)
    products.push(menuItemToGrid(item))
    if (products.length >= MAX_UPSELL) break
  }

  return products
}

function storeUpsell(provider: OrderProviderRef, inCart: Set<string>): CheckoutUpsellProduct[] {
  const nav = provider.navState as { categoryId?: string; subcategory?: string } | null | undefined
  if (nav?.categoryId) {
    const categoryProducts = resolveBoltMarketCategoryProducts(
      nav.categoryId,
      nav.subcategory ?? '',
    )
    if (categoryProducts) {
      return categoryProducts.filter((product) => !inCart.has(product.id)).slice(0, MAX_UPSELL)
    }
  }

  const seen = new Set<string>()
  const products: CheckoutUpsellProduct[] = []

  for (const carousel of storeMerchantCarousels) {
    for (const product of carousel.products) {
      if (seen.has(product.id) || inCart.has(product.id)) continue
      seen.add(product.id)
      products.push({ ...product, id: product.id })
      if (products.length >= MAX_UPSELL) return products
    }
  }

  return products
}

/** Suggested add-ons for checkout — real merchant catalog items not already in the basket. */
export function resolveCheckoutUpsellProducts(
  provider: OrderProviderRef | null,
  cartItemIds: readonly string[],
): CheckoutUpsellProduct[] {
  if (!provider) return []

  const inCart = new Set(cartItemIds)
  return provider.kind === 'restaurant' ? restaurantUpsell(provider, inCart) : storeUpsell(provider, inCart)
}
