import { boltStore } from './boltFoodAssets'
import {
  retailSnippetProducts,
  retailSnippetStore,
  type RetailSnippetProduct,
} from './boltFoodTallinnHomeContent'
import storesScreen from './boltFoodTallinnStoresScreen.json'

type StoresScreenProvider = {
  providerId: number
  title: string
  address: string
  deliveryLabel: string
  deliveryOriginalPrice?: string
  etaText: string
  rating?: string
  reviews?: string
  localFile: string
}

function imageSrcFor(item: StoresScreenProvider): string {
  return boltStore(item.localFile)
}

function toThumbnailM(item: StoresScreenProvider) {
  return {
    title: item.title,
    imageSrc: imageSrcFor(item),
    deliveryLabel: item.deliveryLabel,
    deliveryOriginalPrice: item.deliveryOriginalPrice,
    etaText: item.etaText,
    rating: item.rating,
    reviews: item.reviews,
  }
}

function toThumbnailL(item: StoresScreenProvider) {
  return {
    ...toThumbnailM(item),
    discountPct: null as string | null,
  }
}

const sections = storesScreen.sections as {
  orderAgain: StoresScreenProvider[]
  featured: StoresScreenProvider[]
  allGroceryStores: StoresScreenProvider[]
  boltPlusDiscounts: StoresScreenProvider[]
  bakerySweets: StoresScreenProvider[]
  allStores: StoresScreenProvider[]
}

/**
 * Stores hub — live [Bolt Food Tallinn stores](https://food.bolt.eu/en/1-tallinn/stores/)
 * (`screen_id` 120001, Rotermanni 6). Refresh: `npm run bolt:stores:sync`.
 */
export const storesOrderAgain = sections.orderAgain.map((item) => ({
  line1: item.title,
  line2: item.address,
  imageSrc: imageSrcFor(item),
})) as readonly {
  line1: string
  line2: string
  imageSrc: string
}[]

/** Popular groceries retail snippet — Bolt Market Toompuiestee (Groceries by Bolt). */
const boltMarketFromScreen = sections.allGroceryStores.find((p) => p.providerId === 28032)

export const storesRetailSnippetStore = {
  ...retailSnippetStore,
  ...(boltMarketFromScreen
    ? {
        eta: boltMarketFromScreen.etaText,
        rating: boltMarketFromScreen.rating ?? retailSnippetStore.rating,
        reviews: boltMarketFromScreen.reviews ?? retailSnippetStore.reviews,
        deliveryPrice: boltMarketFromScreen.deliveryLabel,
        imageSrc: imageSrcFor(boltMarketFromScreen),
      }
    : {}),
} as const

export const storesRetailSnippetProducts: readonly RetailSnippetProduct[] = retailSnippetProducts

/** Featured large card — Popular Groceries (display-only). */
export const storesFeatured = toThumbnailL(sections.featured[0]!)

/** Section: All Grocery Stores. */
export const allGroceryStores = sections.allGroceryStores.map(toThumbnailM)

/** Section: Bolt Plus discounts. */
export const boltPlusDiscounts = sections.boltPlusDiscounts.map(toThumbnailM)

/** Section: Bakery & sweets. */
export const bakerySweets = sections.bakerySweets.map(toThumbnailM)

/** All Stores vertical list. */
export const storesAllStoresList = sections.allStores.map(toThumbnailL)
