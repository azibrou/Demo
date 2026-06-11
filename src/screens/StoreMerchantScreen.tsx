import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BannerCarousel } from '../components/BannerCarousel'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { CarouselItem } from '../components/CarouselItem'
import { CategorySearchScreen } from '../components/CategorySearchScreen'
import { CrossFadeStack } from '../components/CrossFadeStack'
import { TopSectionStore } from '../components/TopSectionStore'
import { storeMerchantBannerCarouselSlides } from '../lib/bannerCarouselContent'
import { resolveStoreMerchantProvider } from '../lib/merchantNavigation'
import { storeOrderProviderRef } from '../lib/orderProvider'
import { storeMerchantCarousels } from '../lib/storeMerchantContent'
import { MerchantScreenShell } from '../components/MerchantScreenShell'
import { MerchantOrderProvider } from '../context/OrderContext'
import { useMerchantTab } from '../context/MerchantTabContext'
import { useStackBack } from '../hooks/useStackBack'
import { MerchantAislesTab } from '../sections/merchant/MerchantAislesTab'
import { MerchantListTab } from '../sections/merchant/MerchantListTab'
import { StoreCardDividerBlock, StoreMiniBannersBlock } from '../sections/stores'

/**
 * GroceryHome store merchant — Figma [77237:150610](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77237-150610).
 */
function StoreMerchantVenueTab({
  onBack,
  provider,
}: {
  onBack: () => void
  provider: ReturnType<typeof resolveStoreMerchantProvider>
}) {
  return (
    <div className="flex flex-col">
      <TopSectionStore provider={provider} onBack={onBack} />

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
            <CarouselGridItem key={`${carousel.id}-${product.id}`} itemId={product.id} {...product} />
          ))}
        </CarouselItem>
      ))}
    </div>
  )
}

export function StoreMerchantScreen() {
  const onBack = useStackBack()
  const location = useLocation()
  const orderProvider = useMemo(() => storeOrderProviderRef(location.state), [location.state])
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <MerchantScreenShell onSearchClick={() => setSearchOpen(true)}>
      <StoreMerchantScreenBody onBack={onBack} />
      {searchOpen ? (
        <CategorySearchScreen orderProvider={orderProvider} onClose={() => setSearchOpen(false)} />
      ) : null}
    </MerchantScreenShell>
  )
}

function StoreMerchantScreenBody({ onBack }: { onBack: () => void }) {
  const { activeTabId } = useMerchantTab()
  const location = useLocation()
  const provider = useMemo(() => resolveStoreMerchantProvider(location.state), [location.state])
  const orderProvider = useMemo(() => storeOrderProviderRef(location.state), [location.state])

  const onTabSwitch = useCallback(() => {
    document.querySelector('.merchant-screen')?.scrollTo(0, 0)
  }, [])

  const tabContent =
    activeTabId === 'isles' ? (
      <MerchantAislesTab navigationState={location.state} />
    ) : activeTabId === 'list' ? (
      <MerchantListTab />
    ) : (
      <StoreMerchantVenueTab onBack={onBack} provider={provider} />
    )

  return (
    <MerchantOrderProvider provider={orderProvider}>
      <div className="merchant-screen bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] pb-[calc(env(safe-area-inset-bottom,0px)+96px)] text-[var(--color-content-primary)]">
        <CrossFadeStack activeKey={activeTabId} onSwitch={onTabSwitch}>
          {tabContent}
        </CrossFadeStack>
      </div>
    </MerchantOrderProvider>
  )
}
