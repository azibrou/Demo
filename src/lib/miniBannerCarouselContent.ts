import { design } from './figmaDesignAssets'

const images = design.miniBanner

/** Figma 77303:218074 — inline notification carousel tiles. */
export const miniBannerCarouselItems = [
  {
    id: 'discount',
    title: '15% off on everything',
    subtitle: 'on orders over 15 €',
    imageSrc: images[0]!,
    wide: false,
    variant: 'neutral' as const,
  },
  {
    id: 'delivery',
    title: '0,00 € instant delivery',
    subtitle: 'on orders over 15 €',
    imageSrc: images[1]!,
    wide: false,
    variant: 'neutral' as const,
  },
  {
    id: 'promo',
    title: 'Order 2 fish and chips',
    subtitle: 'get a Coca-Cola as a gift!',
    imageSrc: images[2]!,
    wide: true,
    variant: 'neutral' as const,
  },
  {
    id: 'bolt-plus',
    title: '0,00 € delivery',
    subtitle: 'with Bolt Plus',
    imageSrc: images[3]!,
    wide: false,
    variant: 'action' as const,
  },
] as const

export type MiniBannerCarouselItem = (typeof miniBannerCarouselItems)[number]
