import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import type { SimpleItemProps } from '../components/SimpleItem'
import menu from './ilFornoMenu.json'

/**
 * iL Forno Pärnu mnt — real assortment scraped from
 * https://food.bolt.eu/et-ee/1-tallinn/p/44766-il-forno-parnu-mnt/.
 * Menu + images saved locally (`src/lib/ilFornoMenu.json`, `public/bolt/ilforno/`)
 * via `npm run ilforno:menu`, so it renders and is searchable fully offline.
 */
export const IL_FORNO_NAME = 'iL Forno Pärnu mnt'

/** Local image path under `public/bolt/`. */
function boltImage(rel: string | null | undefined): string | undefined {
  if (!rel) return undefined
  return `${import.meta.env.BASE_URL}bolt/${rel}`
}

/** "PASTA & RISOTTO" → "Pasta & risotto" for headings. */
function toTitle(value: string): string {
  return value
    .toLocaleLowerCase('et-EE')
    .replace(/(^|[\s/])([\p{L}])/gu, (_m, sep, ch) => `${sep}${ch.toLocaleUpperCase('et-EE')}`)
}

export const ilFornoCover = boltImage(menu.provider.cover) ?? ''

export const ilFornoProvider = {
  name: IL_FORNO_NAME,
  rating: menu.provider.rating || '4.7',
  reviews: menu.provider.ratingCount ? `(${menu.provider.ratingCount})` : '(500+)',
  deliveryPrice: menu.provider.deliveryFee || '1,90 €',
  deliveryLabel: 'delivery',
  eta: '20-25',
  etaLabel: 'min',
} as const

const ilFornoDescription = 'Itaalia kiviahjupitsa, käsitsi valmistatud pasta ja klassikalised eelroad. 🍕'

type RestaurantMenuItem = SimpleItemProps & { id: string }

export const ilFornoMenuSections: { id: string; title: string; items: RestaurantMenuItem[] }[] =
  menu.sections.map((section) => ({
    id: section.id,
    title: toTitle(section.title),
    items: section.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      imageSrc: boltImage(item.imageSrc),
    })),
  }))

const pizzaSection = ilFornoMenuSections.find((section) => section.id === 'pitsa') ?? ilFornoMenuSections[0]
const pizzaItems = pizzaSection?.items ?? []

/** Popular carousel — signature pizzas. */
export const ilFornoPopularProducts: (CarouselGridItemProps & { id: string })[] = pizzaItems
  .slice(0, 6)
  .map((item) => ({
    id: `pop-${item.id}`,
    variant: 'default',
    imageSrc: item.imageSrc,
    title: item.title,
    price: item.price,
    unitLabel: pizzaSection?.title ?? 'Pitsa',
  }))

export const ilFornoFeaturedItem: RestaurantMenuItem = (() => {
  const signature = pizzaItems.find((item) => /forno/i.test(item.title)) ?? pizzaItems[0]
  if (!signature) {
    return {
      id: 'ilf-featured',
      badge: 'Popular',
      title: IL_FORNO_NAME,
      description: ilFornoDescription,
      price: '',
    }
  }
  return { ...signature, id: `featured-${signature.id}`, badge: 'Popular' }
})()

export const ilFornoContent = {
  description: ilFornoDescription,
  popular: ilFornoPopularProducts,
  featured: ilFornoFeaturedItem,
  sections: ilFornoMenuSections,
}
