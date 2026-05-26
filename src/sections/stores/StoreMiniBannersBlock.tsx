import { MiniBannerCarousel } from '../../components/MiniBannerCarousel'
import { miniBannerCarouselItems } from '../../lib/miniBannerCarouselContent'

/** Stores screen mini banner row — Figma 77303:218074. */
export function StoreMiniBannersBlock() {
  return <MiniBannerCarousel className="w-full pt-3 pb-0" items={miniBannerCarouselItems} />
}
