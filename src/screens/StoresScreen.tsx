import { AddressSelector } from '../components/AddressSelector'
import { HubTopBar } from '../components/HubTopBar'
import {
  allGroceryStores,
  bakerySweets,
  boltPlusDiscounts,
} from '../lib/boltFoodTallinnStoresContent'
import { HomeHeroBlock } from '../sections/home/HomeHeroBlock'
import { HomeShortcutsBlock } from '../sections/home'
import {
  StoresAllStoresBlock,
  StoresFeaturedStoreBlock,
  StoresOrderAgainBlock,
  StoresPopularGroceriesBlock,
  StoresProviderSectionBlock,
  StoresTopBlock,
} from '../sections/stores'

/**
 * Stores hub — aligned with [Bolt Food Tallinn stores](https://food.bolt.eu/en/1-tallinn/stores/).
 * Only {@link retailSnippetStore} (Bolt Market Toompuiestee) is actionable in this demo.
 */
export function StoresScreen() {
  return (
    <div
      className="home-page bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] pb-[calc(110px+env(safe-area-inset-bottom,0px))] text-[var(--color-content-primary)]"
      data-node-id="77303:218309"
    >
      <HubTopBar>
        <AddressSelector withGutter={false} />
      </HubTopBar>
      <HomeHeroBlock />
      <StoresTopBlock />
      <HomeShortcutsBlock />
      <StoresOrderAgainBlock />
      <StoresPopularGroceriesBlock />
      <StoresFeaturedStoreBlock />
      <StoresProviderSectionBlock
        nodeId="77303:218319"
        title="All Grocery Stores"
        ariaLabel="All Grocery Stores"
        items={allGroceryStores}
      />
      <StoresProviderSectionBlock
        nodeId="77303:218322"
        title="Bolt Plus discounts"
        ariaLabel="Bolt Plus discounts"
        items={boltPlusDiscounts}
      />
      <StoresProviderSectionBlock
        nodeId="77303:218325"
        title="Bakery & sweets"
        ariaLabel="Bakery and sweets"
        items={bakerySweets}
      />
      <StoresAllStoresBlock />
    </div>
  )
}
