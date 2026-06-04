import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import { retailSnippetProducts, retailSnippetStore } from './boltFoodTallinnHomeContent'
import { design } from './figmaDesignAssets'

export type StoreMerchantProduct = CarouselGridItemProps & { id: string }

/** Grocery merchant — matches home {@link retailSnippetStore} (Bolt Market Toompuiestee). */
export const storeMerchantProvider = {
  name: retailSnippetStore.name,
  rating: retailSnippetStore.rating,
  reviews: retailSnippetStore.reviews,
  deliveryPrice: retailSnippetStore.deliveryPrice,
  deliveryLabel: 'delivery',
  eta: '15–25',
  etaLabel: 'min',
  heroImageSrc: retailSnippetStore.imageSrc,
  logoImageSrc: design.topSectionStore.boltMarketToompuiesteeLogo,
} as const

function fromRetail(index: number): StoreMerchantProduct {
  const p = retailSnippetProducts[index]!
  if (p.variant === 'discount') {
    return {
      id: p.id,
      variant: 'discount',
      imageSrc: p.imageSrc,
      title: p.title,
      unitLabel: p.unitLabel,
      priceNow: p.priceNow,
      priceWas: p.priceWas,
      discountLabel: p.discountLabel,
    }
  }
  return {
    id: p.id,
    variant: 'default',
    imageSrc: p.imageSrc,
    title: p.title,
    unitLabel: p.unitLabel,
    price: p.price,
  }
}

const carouselA = [0, 1, 2, 3, 4].map(fromRetail)
const carouselB = [5, 6, 7, 8, 9].map(fromRetail)
const carouselC = [10, 11, 0, 1, 2].map(fromRetail)

/** Figma 77237:153493 — three product carousels. */
export const storeMerchantCarousels = [
  { id: 'poke-bowl', title: 'Poke Bowl Hariduse', products: carouselA },
  { id: 'special-offers', title: 'Special offers', products: carouselB },
  { id: 'poke-bowl-2', title: 'Poke Bowl Hariduse', products: carouselC },
] as const
