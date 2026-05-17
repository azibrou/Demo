import { useMemo } from 'react'
import { FloatingTabBar } from '../components/FloatingTabBar'
import { TabAction } from '../components/TabAction'
import { design } from '../lib/figmaDesignAssets'
import { HeroBanner } from '../components/HeroBanner'
import { HomeSearchSection } from '../components/HomeSearchSection'
import { OrderAgain } from '../components/OrderAgain'
import { RetailSnippet } from '../components/RetailSnippet'
import { ShortcutsCarousel } from '../components/ShortcutsCarousel'
import { ThumbnailLSection } from '../components/ThumbnailLSection'
import { ThumbnailMRow } from '../components/ThumbnailMRow'
import { resolveFloatingTabBarModel } from '../config/floatingTabBarConfig'
import { allRestaurants, mostPopular, saveMe } from '../lib/boltFoodTallinnHomeContent'
import { HOME_FLOATING_TAB_BAR_ITEMS } from './homeFloatingTabBarItems'

export function HomeScreen() {
  const resolved = useMemo(() => resolveFloatingTabBarModel(HOME_FLOATING_TAB_BAR_ITEMS), [])

  return (
    <div className="home-page bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] pb-[calc(110px+env(safe-area-inset-bottom,0px))] text-[var(--color-content-primary)]">
      <header className="w-full min-w-0">
        <HeroBanner />
      </header>
      <HomeSearchSection />
      <ShortcutsCarousel />
      <OrderAgain />
      <RetailSnippet />
      <ThumbnailMRow title="Most popular" ariaLabel="Most popular" items={mostPopular} />
      <ThumbnailMRow title="Save me" ariaLabel="Save me" items={saveMe} />
      <ThumbnailLSection title="All restaurants" items={allRestaurants} />

      {resolved.barItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 w-full max-w-full overflow-x-clip">
          <FloatingTabBar
            items={resolved.barItems}
            defaultActiveId="home"
            ariaLabel="Eater home"
            tabActions={<TabAction iconSrc={design.tabAction.search} ariaLabel="Search" />}
          />
        </div>
      )}
    </div>
  )
}
