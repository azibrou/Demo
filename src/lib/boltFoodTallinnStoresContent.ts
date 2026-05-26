import { boltFoodAssets as a } from './boltFoodAssets'
import type { RetailSnippetProduct } from './boltFoodTallinnHomeContent'

/**
 * Stores hub — Figma [77303:218309](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77303-218309).
 * Imagery from `public/bolt/` (`npm run bolt:assets`).
 */

/** Popular groceries retail snippet — Figma 77303:218317 (Rimi Solaris). */
export const storesRetailSnippetStore = {
  name: 'Rimi Solaris',
  imageSrc: a.boltMarketToompuiestee,
  deliveryPrice: '1,50 €',
  eta: '15–25 min',
  rating: '4.8',
  reviews: '(500+)',
} as const

export const storesRetailSnippetProducts: readonly RetailSnippetProduct[] = [
  {
    id: 'bananas',
    variant: 'default',
    imageSrc: a.retailTangerine,
    title: 'Bananas',
    unitLabel: '1 kg',
    price: '1,50 €',
  },
  {
    id: 'oat-drink',
    variant: 'discount',
    imageSrc: a.retailAlmaMilk,
    title: 'Oddly Good Barista oat drink',
    unitLabel: '1 l',
    priceNow: '1,50 €',
    priceWas: '3,50 €',
    discountLabel: '-25 %',
  },
  {
    id: 'lemon',
    variant: 'default',
    imageSrc: a.retailAppleRoyalGala,
    title: 'Lemon',
    unitLabel: '1 pc',
    price: '0,89 €',
  },
] as const

/** Featured large card — Figma 77303:218318 (Candy POP Solaris). */
export const storesFeatured = {
  title: 'Candy POP Solaris',
  imageSrc: a.boltMarketToompuiestee,
  deliveryLabel: '0,00 €',
  etaText: '15–30 min',
  discountPct: null,
  rating: '4.5',
  reviews: '(50+)',
} as const

/** Section: All Grocery Stores — Figma 77303:218319. */
export const allGroceryStores = [
  {
    title: 'Delice Solaris',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '1,50 €',
    deliveryOriginalPrice: '3,50 €',
    etaText: '15–25 min',
    rating: '4.6',
    reviews: '(200+)',
  },
  {
    title: 'Selver Mustika',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '1,90 €',
    etaText: '20–30 min',
    rating: '4.6',
    reviews: '(89)',
  },
  {
    title: 'Rimi Hypermarket Mustamäe',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '2,90 €',
    etaText: '25–35 min',
    rating: '4.5',
    reviews: '(120)',
  },
] as const

/** Section: Bolt Plus discounts — Figma 77303:218322. */
export const boltPlusDiscounts = [
  {
    title: 'Bolt Market Toompuiestee',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '0,00 €',
    deliveryOriginalPrice: '1,90 €',
    etaText: '15–25 min',
    rating: '5.0',
    reviews: '(500+)',
  },
  {
    title: 'Bolt Market Tulika',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '0,00 €',
    deliveryOriginalPrice: '3,50 €',
    etaText: '15–20 min',
    rating: '4.8',
    reviews: '(232)',
  },
  {
    title: 'Selver Mustika',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '0,00 €',
    deliveryOriginalPrice: '2,90 €',
    etaText: '20–30 min',
    rating: '4.6',
    reviews: '(89)',
  },
] as const

/** Section: Bakery & sweets — Figma 77303:218325. */
export const bakerySweets = [
  {
    title: 'Pavlova Viru Keskus',
    imageSrc: a.pavlovaViruKeskus,
    deliveryLabel: '1,90 €',
    etaText: '15–20 min',
    rating: '4.7',
    reviews: '(300+)',
  },
  {
    title: 'Bolt Market Toompuiestee',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    rating: '5.0',
    reviews: '(500+)',
  },
  {
    title: 'Candy POP Solaris',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '0,00 €',
    etaText: '15–30 min',
    rating: '4.5',
    reviews: '(50+)',
  },
] as const

/** All Stores list — Figma 77303:218328 (two Thumb L cards). */
export const storesAllStoresList = [
  {
    title: 'Bolt Market Toompuiestee',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '5.0',
    reviews: '(500+)',
  },
  {
    title: 'Bolt Market Tulika',
    imageSrc: a.boltMarketToompuiestee,
    deliveryLabel: '3,50 €',
    etaText: '15–20 min',
    discountPct: null,
    rating: '4.8',
    reviews: '(232)',
  },
] as const
