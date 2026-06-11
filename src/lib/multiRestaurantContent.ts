/**
 * Real menu content for 9 restaurants — loaded from scraped JSON files in
 * src/lib/restaurantMenus/ (images under public/bolt/<slug>/).
 *
 * Refresh with:  npm run restaurants:menu
 */

import type { RestaurantContent, RestaurantMenuSection } from './restaurantMerchantContent'
import type { SimpleItemProps } from '../components/SimpleItem'

import amijamiMenu from './restaurantMenus/amijami.json'
import damakMenu from './restaurantMenus/damak.json'
import pokeBowlMenu from './restaurantMenus/poke-bowl-kristiine.json'
import nikolayMenu from './restaurantMenus/nikolay.json'
import amalfiMenu from './restaurantMenus/amalfi.json'
import shaurmaMenu from './restaurantMenus/shaurma.json'
import kolmTilliMenu from './restaurantMenus/kolm-tilli.json'
import hesburgerMenu from './restaurantMenus/hesburger.json'
import tommiGrillMenu from './restaurantMenus/tommi-grill.json'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function boltImage(rel: string | null | undefined): string | undefined {
  if (!rel) return undefined
  return `${import.meta.env.BASE_URL}bolt/${rel}`
}

type ScrapedMenu = {
  source: string
  provider: { name: string; cover: string | null }
  sections: {
    id: string
    title: string
    items: {
      id: string
      title: string
      description?: string
      price: string
      imageSrc: string | null
    }[]
  }[]
}

function toTitle(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/(^|[\s/])([\p{L}])/gu, (_m, sep, ch) => `${sep}${ch.toLocaleUpperCase()}`)
}

function menuToContent(menu: ScrapedMenu, name: string, description: string): RestaurantContent {
  const sections: RestaurantMenuSection[] = menu.sections.map((section) => ({
    id: section.id,
    title: toTitle(section.title),
    items: section.items.map((item): SimpleItemProps & { id: string } => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      ...(item.imageSrc ? { imageSrc: boltImage(item.imageSrc) } : {}),
    })),
  }))

  const firstSection = sections[0]
  const firstItem = firstSection?.items[0]

  const popular = (firstSection?.items.slice(0, 5) ?? []).map((item, i) => ({
    id: `pop-${item.id}-${i}`,
    variant: 'default' as const,
    title: item.title,
    price: item.price ?? '',
    imageSrc: item.imageSrc,
  }))

  const featured: SimpleItemProps & { id: string } = {
    id: `featured-${firstItem?.id ?? 'item'}`,
    badge: 'Popular',
    title: firstItem?.title ?? name,
    description: firstItem?.description,
    price: firstItem?.price ?? '',
    imageSrc: firstItem?.imageSrc,
  }

  return { carouselTitle: name, description, popular, featured, sections }
}

// ---------------------------------------------------------------------------
// Restaurant names
// ---------------------------------------------------------------------------

export const AMIJAMI_NAME = 'Amijami Sushi Kadriorg'
export const DAMAK_NAME = 'Damak Döner & Kebab'
export const POKE_BOWL_KRISTIINE_NAME = 'Poke Bowl Kristiine'
export const LITTLE_JAPAN_OLD_NAME = 'Little Japan Kesklinn'
export const NIKOLAY_NAME = 'Nikolay Bar-buffeé'
export const AMALFI_NAME = 'Amalfi Ristorante Pizzeria'
export const SHAURMA_NAME = 'Shaurma Kebab Viru Keskus'
export const KOLM_TILLI_NAME = 'Kolm Tilli Tallinn'
export const HESBURGER_NAME = 'Hesburger Viru tänav'
export const TOMMI_GRILL_NAME = 'Tommi Grill Metro'

export const MULTI_RESTAURANT_NAMES = [
  AMIJAMI_NAME,
  DAMAK_NAME,
  POKE_BOWL_KRISTIINE_NAME,
  LITTLE_JAPAN_OLD_NAME,
  NIKOLAY_NAME,
  AMALFI_NAME,
  SHAURMA_NAME,
  KOLM_TILLI_NAME,
  HESBURGER_NAME,
  TOMMI_GRILL_NAME,
] as const

export type MultiRestaurantName = (typeof MULTI_RESTAURANT_NAMES)[number]

// ---------------------------------------------------------------------------
// Content (lazy — built on first call via resolveMultiRestaurantContent)
// ---------------------------------------------------------------------------

export function resolveMultiRestaurantContent(name: string): RestaurantContent | null {
  switch (name) {
    case AMIJAMI_NAME:
      return menuToContent(
        amijamiMenu as ScrapedMenu,
        AMIJAMI_NAME,
        'Fresh sushi, rolls and Japanese classics made to order. 🍣',
      )
    case DAMAK_NAME:
      return menuToContent(
        damakMenu as ScrapedMenu,
        DAMAK_NAME,
        'Authentic döner & kebab — juicy grilled meat, fresh wraps, crispy fries. 🌯',
      )
    case POKE_BOWL_KRISTIINE_NAME:
    case LITTLE_JAPAN_OLD_NAME:
      return menuToContent(
        pokeBowlMenu as ScrapedMenu,
        POKE_BOWL_KRISTIINE_NAME,
        '2022 "Green Choice" 🏆 Fresh poke bowls, wraps and warm teriyaki bowls.',
      )
    case NIKOLAY_NAME:
      return menuToContent(
        nikolayMenu as ScrapedMenu,
        NIKOLAY_NAME,
        'Very tasty pies! Homemade Russian and Estonian food, breakfast all day. 🥧',
      )
    case AMALFI_NAME:
      return menuToContent(
        amalfiMenu as ScrapedMenu,
        AMALFI_NAME,
        'Authentic Italian stone-baked pizza and handmade pasta. Buon appetito! 🍕',
      )
    case SHAURMA_NAME:
      return menuToContent(
        shaurmaMenu as ScrapedMenu,
        SHAURMA_NAME,
        'The true gem of value meals — one of the best kebabs in town! 🌯',
      )
    case KOLM_TILLI_NAME:
      return menuToContent(
        kolmTilliMenu as ScrapedMenu,
        KOLM_TILLI_NAME,
        '🍕 Pizza and pasta made with passion in the heart of Tallinn.',
      )
    case HESBURGER_NAME:
      return menuToContent(
        hesburgerMenu as ScrapedMenu,
        HESBURGER_NAME,
        '🍟 Fast-food classics done right — iconic burgers, golden fries and creamy milkshakes.',
      )
    case TOMMI_GRILL_NAME:
      return menuToContent(
        tommiGrillMenu as ScrapedMenu,
        TOMMI_GRILL_NAME,
        'Freshly grilled meats and classic comfort food right by Metro. 🔥',
      )
    default:
      return null
  }
}
