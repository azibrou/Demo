import { useMemo } from 'react'
import { Banner } from '../components/Banner'
import { CardDivider } from '../components/CardDivider'
import { CarouselItem } from '../components/CarouselItem'
import { Categories } from '../components/Categories'
import { FloatingTabBar } from '../components/FloatingTabBar'
import { MiniBannerCarousel } from '../components/MiniBannerCarousel'
import { MoreToExplore } from '../components/MoreToExplore'
import { ProviderHeader } from '../components/ProviderHeader'
import { QuickNav } from '../components/QuickNav'
import { resolveFloatingTabBarModel } from '../config/floatingTabBarConfig'
import { STORES_FLOATING_TAB_BAR_ITEMS } from './storesFloatingTabBarItems'

export function StoresScreen() {
  const resolved = useMemo(() => resolveFloatingTabBarModel(STORES_FLOATING_TAB_BAR_ITEMS), [])

  return (
    <div className="relative min-h-svh w-full pb-[calc(110px+env(safe-area-inset-bottom,0px))]">
      <div className="flex flex-col gap-0">
        <ProviderHeader />
        <MiniBannerCarousel />
        <CardDivider />
        <QuickNav />
        <Banner />
        <CarouselItem title="Order again" />
        <CarouselItem title="Most popular" />
        <CarouselItem title="Save me" />
        <MoreToExplore />
        <Categories />
      </div>

      {resolved.barItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 w-full">
          <FloatingTabBar items={resolved.barItems} defaultActiveId="store" />
        </div>
      )}
    </div>
  )
}
