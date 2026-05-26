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
    <div className="home-page bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] pb-[calc(110px+env(safe-area-inset-bottom,0px))] text-[var(--color-content-primary)]">
      <header className="w-full min-w-0">
        <HomeHeroBlock />
      </header>
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
