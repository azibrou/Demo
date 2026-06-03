import { AddressSelector } from '../components/AddressSelector'
import { HubTopBar } from '../components/HubTopBar'
import {
  HomeAllRestaurantsBlock,
  HomeHeroBlock,
  HomeMostPopularBlock,
  HomeOrderAgainBlock,
  HomeRetailBlock,
  HomeSaveMeBlock,
  HomeSearchBlock,
  HomeShortcutsBlock,
} from '../sections/home'

export function HomeScreen() {
  return (
    <div className="home-page bolt-font-base relative min-h-svh w-full max-w-full min-w-0 bg-[var(--color-layer-floor-0)] pb-[calc(110px+env(safe-area-inset-bottom,0px))] text-[var(--color-content-primary)]">
      <div className="home-hero-stack w-full max-w-full min-w-0">
        <HubTopBar>
          <AddressSelector withGutter={false} />
        </HubTopBar>
        <header className="w-full min-w-0 max-w-full">
          <HomeHeroBlock />
        </header>
      </div>
      <HomeSearchBlock />
      <HomeShortcutsBlock />
      <HomeOrderAgainBlock />
      <HomeRetailBlock />
      <HomeMostPopularBlock />
      <HomeSaveMeBlock />
      <HomeAllRestaurantsBlock />
    </div>
  )
}
