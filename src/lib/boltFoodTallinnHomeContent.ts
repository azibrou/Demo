import { boltFoodAssets as a } from './boltFoodAssets'
import { design } from './figmaDesignAssets'
import { ilFornoCover } from './ilFornoMerchantContent'

const shortcutIcons = design.shortcuts

/** Icon crop — Figma 76281:68503 per-tile art direction. */
export type HomeShortcutIconVariant = 'basket' | 'contain' | 'cover' | 'iceCream'

export type HomeShortcut = {
  id: string
  label: string
  iconSrc: string
  iconVariant: HomeShortcutIconVariant
  /** Figma: single-line ellipsis vs two-line compact label. */
  labelSingleLine?: boolean
  to?: string
  /** Category on live Bolt Food Tallinn (`getScreenContent` / home shortcuts row). */
  boltHref?: string
}

/**
 * Home shortcuts — labels match [Bolt Food Tallinn](https://food.bolt.eu/en/1-tallinn/) filter row;
 * icons from Figma 76281:68503 (`public/figma/`, `npm run figma:sync`).
 */
export const homeShortcuts: readonly HomeShortcut[] = [
  {
    id: 'all-stores',
    label: 'All stores',
    iconSrc: shortcutIcons.allStores,
    iconVariant: 'basket',
    labelSingleLine: true,
    boltHref: 'https://food.bolt.eu/en/1-tallinn/stores/',
  },
  {
    id: 'groceries',
    label: 'Groceries',
    iconSrc: shortcutIcons.groceries,
    iconVariant: 'contain',
    labelSingleLine: true,
    boltHref: 'https://food.bolt.eu/en/1-tallinn/',
  },
  {
    id: 'alcoholic-beverages',
    label: 'Alcoholic beverages',
    iconSrc: shortcutIcons.alcoholicBeverages,
    iconVariant: 'cover',
    boltHref: 'https://food.bolt.eu/en/1-tallinn/',
  },
  {
    id: 'ice-cream',
    label: 'Ice cream',
    iconSrc: shortcutIcons.iceCream,
    iconVariant: 'iceCream',
    labelSingleLine: true,
    boltHref: 'https://food.bolt.eu/en/1-tallinn/',
  },
  {
    id: 'flowers',
    label: 'Flowers',
    iconSrc: shortcutIcons.flowers,
    iconVariant: 'contain',
    labelSingleLine: true,
    boltHref: 'https://food.bolt.eu/en/1-tallinn/',
  },
] as const

/**
 * Restaurant / store imagery and copy aligned with live Bolt Food Tallinn
 * (`https://food.bolt.eu/et-ee/1-tallinn/`) — data taken from the same public
 * `getScreenContent` payload (screen_id=360003, city_id=1) used by that page.
 * Cover photos are stored under `public/bolt/` (`npm run bolt:assets`).
 */

/** Order again — same first-row vendors as on the live home carousel when unauthenticated. */
export const orderAgain = [
  {
    line1: 'Bolt Market Toompuiestee',
    line2: 'Toompuiestee 33a',
    imageSrc: a.boltMarketToompuiestee,
  },
  {
    line1: "McDonald's® Viru",
    line2: 'Viru 24',
    imageSrc: a.mcdonaldsViru,
  },
  {
    line1: 'Amijami Sushi Kadriorg',
    line2: 'Vesivärava 50',
    imageSrc: a.amijamiSushiKadriorg,
  },
  {
    line1: 'Damak Döner & Kebab',
    line2: 'Kaubamaja 6',
    imageSrc: a.damakDonerKebab,
  },
] as const

/**
 * Retail snippet — [Bolt Market Toompuiestee](https://food.bolt.eu/en/1-tallinn/p/28032-bolt-market-toompuiestee/)
 * (`provider_id` 28032). Twelve products: first SKU from each of the store’s first twelve menu
 * categories (public menu HTML; mirrors featured picks per aisle).
 */
export const retailSnippetStore = {
  name: 'Bolt Market Toompuiestee',
  imageSrc: a.boltMarketToompuiestee,
  deliveryPrice: '1,90 €',
  eta: '15–25 min',
  rating: '5.0',
  reviews: '(500+)',
} as const

export type RetailSnippetProduct =
  | {
      id: string
      variant: 'default'
      imageSrc: string
      title: string
      unitLabel: string
      price: string
    }
  | {
      id: string
      variant: 'discount'
      imageSrc: string
      title: string
      unitLabel: string
      priceNow: string
      priceWas: string
      discountLabel: string
    }

export const retailSnippetProducts: readonly RetailSnippetProduct[] = [
  {
    id: 'magnum-bonbon',
    variant: 'default',
    imageSrc: a.retailMagnumBonbon,
    title: 'Magnum, BonBon Salted Caramel & Almond Ice Cream',
    unitLabel: '12x17ml',
    price: '6,19 €',
  },
  {
    id: 'mamma-pasta-ham',
    variant: 'default',
    imageSrc: a.retailMammaPastaHam,
    title: 'Mamma, Pasta-ham Salad',
    unitLabel: '400g',
    price: '4,35 €',
  },
  {
    id: 'tangerine',
    variant: 'default',
    imageSrc: a.retailTangerine,
    title: 'Tangerine',
    unitLabel: '1kg',
    price: '2,99 €',
  },
  {
    id: 'fazer-rye-bread',
    variant: 'default',
    imageSrc: a.retailFazerRyeBread,
    title: 'Fazer, Sourdough Fine Rye Bread',
    unitLabel: '500g',
    price: '1,85 €',
  },
  {
    id: 'apple-royal-gala',
    variant: 'discount',
    imageSrc: a.retailAppleRoyalGala,
    title: 'Apple "Royal Gala"',
    unitLabel: '500g',
    priceNow: '1,09 €',
    priceWas: '1,49 €',
    discountLabel: '−25 %',
  },
  {
    id: 'alma-milk',
    variant: 'default',
    imageSrc: a.retailAlmaMilk,
    title: 'Alma, Milk 2.5%',
    unitLabel: '1,5l',
    price: '1,99 €',
  },
  {
    id: 'estover-cheese',
    variant: 'default',
    imageSrc: a.retailEstoverCheese,
    title: 'Estover, Sliced Estonian Cheese',
    unitLabel: '200g',
    price: '3,29 €',
  },
  {
    id: 'pork-tenderloin',
    variant: 'default',
    imageSrc: a.retailPorkTenderloin,
    title: 'Nõo, Pork Tenderloin',
    unitLabel: '~500g',
    price: '7,15 €',
  },
  {
    id: 'sunfood-beans',
    variant: 'default',
    imageSrc: a.retailSunfoodBeans,
    title: 'Sunfood, Baked Beans in Tomato Sauce',
    unitLabel: '400g',
    price: '1,19 €',
  },
  {
    id: 'bon-vegan-tofu',
    variant: 'default',
    imageSrc: a.retailBonVeganTofu,
    title: 'Bon Vegan, Tofu Unflavored',
    unitLabel: '250g',
    price: '2,69 €',
  },
  {
    id: 'coca-cola-zero',
    variant: 'default',
    imageSrc: a.retailCocaColaZero,
    title: 'Coca-Cola, Zero Sugar and Coffeine Free',
    unitLabel: '0,33l',
    price: '1,19 €',
  },
  {
    id: 'battery-energy',
    variant: 'default',
    imageSrc: a.retailBatteryEnergy,
    title: 'Battery, Energy Drink Juiced Euphoria',
    unitLabel: '0.33l',
    price: '1,89 €',
  },
]

/** Retail row — “Toidukaubad ja muu” horizontal stores (Rimi, Selver, Bolt Market) + representative item copy. */
export const retailTiles = {
  defaultA: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-04-22/38882874-a403-4a93-8b8f-13ad65e0d48a.jpeg',
    title: 'Tere piim 2,8%, 1 l — tarbik enne: vt pakendilt',
    unitLabel: '1 l',
    price: '1,09 €',
  },
  discount: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-01-27/f795d7e0-1505-46ba-abe6-4c1791e55514.jpeg',
    title: 'Merevaik Classic jäätis, 480 ml',
    unitLabel: '480 ml',
    priceNow: '2,99 €',
    priceWas: '3,99 €',
    discountLabel: '−25 %',
  },
  defaultB: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-03-03/f23b4550-d6cb-4c7c-8d2e-af499e181eb6.jpeg',
    title: 'Polar leib, 440 g',
    unitLabel: '440 g',
    price: '1,89 €',
  },
} as const

/** “Kõrgelt hinnatud” carousel on the same screen payload. */
export const mostPopular = [
  {
    title: 'iL Forno Pärnu mnt',
    imageSrc: ilFornoCover,
    deliveryLabel: '1,90 €',
    etaText: '20–25 min',
    rating: '4.7',
    reviews: '(500+)',
  },
  {
    title: 'Pavlova Viru Keskus',
    imageSrc: a.pavlovaViruKeskus,
    deliveryLabel: '1,90 €',
    etaText: '15–20 min',
  },
  {
    title: 'Poke Bowl Kristiine',
    imageSrc: a.littleJapanKesklinn,
    deliveryLabel: '1,90 €',
    etaText: '40–45 min',
  },
  {
    title: 'Nikolay Bar-buffeé',
    imageSrc: a.nikolayBarBuffee,
    deliveryLabel: '1,90 €',
    etaText: '20–25 min',
  },
] as const

/** “Kiireim kohalevedu” carousel. */
export const saveMe = [
  {
    title: 'Amalfi Ristorante Pizzeria',
    imageSrc: a.amalfiRistorantePizzeria,
    deliveryLabel: '1,90 €',
    etaText: '10–15 min',
  },
  {
    title: 'Shaurma Kebab Viru Keskus',
    imageSrc: a.shaurmaKebabViruKeskus,
    deliveryLabel: '1,90 €',
    etaText: '10–15 min',
  },
  {
    title: 'Amijami Sushi Kadriorg',
    imageSrc: a.amijamiSushiKadriorg,
    deliveryLabel: '1,90 €',
    etaText: '25–35 min',
  },
  {
    title: 'Damak Döner & Kebab',
    imageSrc: a.damakDonerKebab,
    deliveryLabel: '1,90 €',
    etaText: '15–20 min',
  },
] as const

/** First row of “Vaata kõiki kohti” list in the same payload. */
export const allRestaurants = [
  {
    title: 'Kolm Tilli Tallinn',
    imageSrc: a.kolmTilliTallinn,
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.6',
    reviews: '(210)',
  },
  {
    title: 'Hesburger Viru tänav',
    imageSrc: a.hesburgerViruTanav,
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.5',
    reviews: '(500+)',
  },
  {
    title: 'Tommi Grill Metro',
    imageSrc: a.tommiGrillMetro,
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.5',
    reviews: '(500+)',
  },
  {
    title: 'Pavlova Viru Keskus',
    imageSrc: a.pavlovaViruKeskus,
    deliveryLabel: '1,90 €',
    etaText: '15–20 min',
    discountPct: '−25%',
    rating: '4.7',
    reviews: '(300+)',
  },
  {
    title: 'Amalfi Ristorante Pizzeria',
    imageSrc: a.amalfiRistorantePizzeria,
    deliveryLabel: '1,90 €',
    etaText: '10–15 min',
    discountPct: null,
    rating: '4.6',
    reviews: '(180)',
  },
] as const
