import type { TopSectionRestaurantProvider } from '../components/TopSectionRestaurant'
import type { TopSectionStoreProvider } from '../components/TopSectionStore'
import { retailSnippetStore } from './boltFoodTallinnHomeContent'
import { design } from './figmaDesignAssets'
import { restaurantMerchantProvider } from './restaurantMerchantContent'
import { storeMerchantProvider } from './storeMerchantContent'
import type { ThumbnailLListBlockItem } from '../sections/blocks/ThumbnailLListBlock'
import type { ThumbnailMRowBlockItem } from '../sections/blocks/ThumbnailMRowBlock'

export type StoreMerchantNavState = {
  kind: 'store'
  name: string
  heroImageSrc: string
  logoImageSrc: string
  rating: string
  reviews: string
  deliveryPrice: string
  deliveryLabel: string
  eta: string
  etaLabel: string
}

export type RestaurantMerchantNavState = {
  kind: 'restaurant'
  name: string
  heroImageSrc: string
  rating: string
  reviews: string
  deliveryPrice: string
  deliveryLabel: string
  eta: string
  etaLabel: string
}

export function isStoreMerchantNavState(value: unknown): value is StoreMerchantNavState {
  return (
    typeof value === 'object' &&
    value != null &&
    (value as StoreMerchantNavState).kind === 'store' &&
    typeof (value as StoreMerchantNavState).name === 'string'
  )
}

export function isRestaurantMerchantNavState(value: unknown): value is RestaurantMerchantNavState {
  return (
    typeof value === 'object' &&
    value != null &&
    (value as RestaurantMerchantNavState).kind === 'restaurant' &&
    typeof (value as RestaurantMerchantNavState).name === 'string'
  )
}

export function parseEtaText(etaText: string): { eta: string; etaLabel: string } {
  const trimmed = etaText.trim()
  const match = trimmed.match(/^(.+?)\s*min$/i)
  if (match) return { eta: match[1].trim(), etaLabel: 'min' }
  return { eta: trimmed, etaLabel: 'min' }
}

export function boltMarketToompuiesteeStoreNavState(): StoreMerchantNavState {
  return {
    kind: 'store',
    name: retailSnippetStore.name,
    heroImageSrc: retailSnippetStore.imageSrc,
    logoImageSrc: design.topSectionStore.boltMarketToompuiesteeLogo,
    rating: retailSnippetStore.rating,
    reviews: retailSnippetStore.reviews,
    deliveryPrice: retailSnippetStore.deliveryPrice,
    deliveryLabel: 'delivery',
    ...parseEtaText(retailSnippetStore.eta),
  }
}

export function isBoltMarketToompuiesteeLabel(line1: string): boolean {
  return line1 === retailSnippetStore.name
}

/** Shared fields for M/L thumbnail → restaurant merchant navigation. */
export type ThumbnailRestaurantNavInput = {
  title: string
  imageSrc: string
  deliveryLabel: string
  etaText: string
  rating?: string
  reviews?: string
}

function thumbnailToRestaurantNavState(item: ThumbnailRestaurantNavInput): RestaurantMerchantNavState {
  const { eta, etaLabel } = parseEtaText(item.etaText)
  return {
    kind: 'restaurant',
    name: item.title,
    heroImageSrc: item.imageSrc,
    rating: item.rating ?? '4.6',
    reviews: item.reviews ?? '(200+)',
    deliveryPrice: item.deliveryLabel,
    deliveryLabel: 'delivery',
    eta,
    etaLabel,
  }
}

export function thumbnailMToRestaurantNavState(item: ThumbnailMRowBlockItem): RestaurantMerchantNavState {
  return thumbnailToRestaurantNavState(item)
}

export function thumbnailLToRestaurantNavState(item: ThumbnailLListBlockItem): RestaurantMerchantNavState {
  return thumbnailToRestaurantNavState(item)
}

export function resolveStoreMerchantProvider(state: unknown): TopSectionStoreProvider & {
  heroImageSrc: string
  logoImageSrc: string
} {
  if (!isStoreMerchantNavState(state)) {
    return storeMerchantProvider
  }
  return {
    name: state.name,
    rating: state.rating,
    reviews: state.reviews,
    deliveryPrice: state.deliveryPrice,
    deliveryLabel: state.deliveryLabel,
    eta: state.eta,
    etaLabel: state.etaLabel,
    heroImageSrc: state.heroImageSrc,
    logoImageSrc: state.logoImageSrc,
  }
}

export function resolveRestaurantMerchantProvider(state: unknown): TopSectionRestaurantProvider & {
  heroImageSrc: string
} {
  if (!isRestaurantMerchantNavState(state)) {
    return { ...restaurantMerchantProvider, heroImageSrc: design.topSectionRestaurant.hero }
  }
  return {
    name: state.name,
    rating: state.rating,
    reviews: state.reviews,
    deliveryPrice: state.deliveryPrice,
    deliveryLabel: state.deliveryLabel,
    eta: state.eta,
    etaLabel: state.etaLabel,
    heroImageSrc: state.heroImageSrc,
  }
}
