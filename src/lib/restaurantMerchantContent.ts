import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import type { SimpleItemProps } from '../components/SimpleItem'
import { retailSnippetProducts } from './boltFoodTallinnHomeContent'
import { design } from './figmaDesignAssets'
import { IL_FORNO_NAME, ilFornoContent } from './ilFornoMerchantContent'

const rm = design.restaurantMerchant
const carouselProduct = design.carousel.product

export const restaurantMerchantProvider = {
  name: 'Poke Bowl Hariduse',
  rating: '4.8',
  reviews: '(232)',
  deliveryPrice: '3,50 €',
  deliveryLabel: 'delivery',
  eta: '15-20',
  etaLabel: 'min',
} as const

export const restaurantMerchantDescription =
  'Poke Bowl is perhaps the most loved 🍲 places in Estonia. They are very tasty!'

function fromRetail(index: number): CarouselGridItemProps & { id: string } {
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

/** Figma 77237:146401 — Popular horizontal carousel. */
export const restaurantPopularProducts = [0, 1, 2, 3].map(fromRetail)

export const restaurantFeaturedItem = {
  badge: 'Popular',
  title: 'Poke with Chicken',
  description: 'Rice, Salad, Chicken, Red Cabage, Carrot, Spinach...',
  price: '11,50 €',
  priceWas: '13,50 €',
  tags: [{ label: 'Spicy', iconSrc: rm.tagSpicy }],
  imageSrc: rm.menuItemImage,
} satisfies SimpleItemProps

export type RestaurantMenuItem = SimpleItemProps & { id: string }

const menuDescription =
  'Bun, 100% angus beef patty, Uulits herb mayonnaise and coconut'

const pokeBowlItems: RestaurantMenuItem[] = [
  {
    id: 'poke-1',
    title: 'Chichen Miso Ramen',
    description: menuDescription,
    price: '1,50 €',
    imageSrc: rm.menuItemImageAlt,
  },
  {
    id: 'poke-2',
    title: 'Chichen Miso Ramen',
    description: menuDescription,
    price: '1,50 €',
    imageSrc: rm.menuItemImage,
  },
  {
    id: 'poke-3',
    title: 'Chichen Miso Ramen with a very long title that wraps to two lines',
    description: menuDescription,
    price: '1,50 €',
    imageSrc: carouselProduct,
  },
  {
    id: 'poke-4',
    title: 'Chichen Miso Ramen with a very long title that wraps to two lines',
    description: menuDescription,
    price: '1,50 €',
    imageSrc: rm.menuItemImageAlt,
  },
]

const saladItems: RestaurantMenuItem[] = pokeBowlItems.map((item, i) => ({
  ...item,
  id: `salad-${i + 1}`,
}))

const unavailableItems: RestaurantMenuItem[] = [
  {
    id: 'unavail-1',
    statusLabel: 'Not in stock',
    title: 'Chichen Miso Ramen',
    description: menuDescription,
    price: '1,50 €',
    hideImage: true,
  },
  {
    id: 'unavail-2',
    statusLabel: 'Not in stock',
    title: 'Chichen Miso Ramen',
    description: menuDescription,
    price: '1,50 €',
    tags: [
      { label: 'Spicy', iconSrc: rm.tagSpicy },
      { label: 'Vegetarian' },
    ],
    imageSrc: rm.menuItemImage,
  },
]

/** Figma 77237:146415+ — menu category sections (featured row is separate). */
export const restaurantMenuSections = [
  { id: 'poke-bowl', title: 'Poke Bowl Hariduse', items: pokeBowlItems },
  { id: 'salads', title: 'Salads', items: saladItems },
  { id: 'unavailable', title: 'Sides', items: unavailableItems },
] as const

export type RestaurantMenuSection = {
  id: string
  title: string
  items: readonly (SimpleItemProps & { id: string })[]
}

export type RestaurantContent = {
  /** Carousel section title (e.g. provider name). */
  carouselTitle: string
  description: string
  popular: readonly (CarouselGridItemProps & { id: string })[]
  featured: SimpleItemProps & { id: string }
  sections: readonly RestaurantMenuSection[]
}

const defaultRestaurantContent: RestaurantContent = {
  carouselTitle: restaurantMerchantProvider.name,
  description: restaurantMerchantDescription,
  popular: restaurantPopularProducts,
  featured: { id: 'featured-poke-chicken', ...restaurantFeaturedItem },
  sections: restaurantMenuSections,
}

/** Flattened searchable item (search overlay). */
export type RestaurantAssortmentItem = SimpleItemProps & { itemId: string }

export function restaurantAssortment(content: RestaurantContent): RestaurantAssortmentItem[] {
  return [
    { ...content.featured, itemId: content.featured.id },
    ...content.sections.flatMap((section) =>
      section.items.map((item) => ({ ...item, itemId: item.id })),
    ),
  ]
}

/** Per-merchant assortment resolution by provider name. */
export function resolveRestaurantContent(name: string): RestaurantContent {
  if (name === IL_FORNO_NAME) {
    return {
      carouselTitle: IL_FORNO_NAME,
      description: ilFornoContent.description,
      popular: ilFornoContent.popular,
      featured: ilFornoContent.featured,
      sections: ilFornoContent.sections,
    }
  }
  return defaultRestaurantContent
}
