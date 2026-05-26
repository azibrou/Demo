import { design } from './figmaDesignAssets'

const b = design.bannerCarousel

/** Banner carousel raster slides — Figma 77842:552848, 77842:552851. */
export const storeMerchantBannerCarouselSlides = [b.slideA, b.slideB] as const

/** Stores hub promo — Figma 77303:218315 (BannerCarousel Multiple @ 375). */
export const storesHubBannerCarouselSlides = storeMerchantBannerCarouselSlides
