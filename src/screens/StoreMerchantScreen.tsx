import { BannerCarousel } from '../components/BannerCarousel'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { CarouselItem } from '../components/CarouselItem'
import { TopSectionStore } from '../components/TopSectionStore'
import { storeMerchantBannerCarouselSlides } from '../lib/bannerCarouselContent'
import { storeMerchantCarousels, storeMerchantProvider } from '../lib/storeMerchantContent'
import { MerchantScreenShell } from '../components/MerchantScreenShell'
import { useStackBack } from '../hooks/useStackBack'
import { StoreCardDividerBlock, StoreMiniBannersBlock } from '../sections/stores'

/**
 * GroceryHome store merchant — Figma [77237:150610](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77237-150610).
 */
export function StoreMerchantScreen() {
  const onBack = useStackBack()

  return (
    <MerchantScreenShell>
    <div className="bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] pb-[calc(env(safe-area-inset-bottom,0px)+96px)] text-[var(--color-content-primary)]">
      <div className="flex flex-col">
        <TopSectionStore provider={storeMerchantProvider} onBack={onBack} />

        <StoreMiniBannersBlock />

        <StoreCardDividerBlock />

        {/* Promo — 77237:150637; banners 77842:552848, 77842:552851 */}
        <BannerCarousel
          banners={storeMerchantBannerCarouselSlides}
          data-node-id="77237:150637"
        />

        {/* Product carousels — 77237:153493 */}
        {storeMerchantCarousels.map((carousel) => (
          <CarouselItem key={carousel.id} title={carousel.title}>
            {carousel.products.map((product) => (
              <CarouselGridItem key={`${carousel.id}-${product.id}`} {...product} />
            ))}
          </CarouselItem>
        ))}
      </div>
    </div>
    </MerchantScreenShell>
  )
}
