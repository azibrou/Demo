import { AddressSelector } from '../../components/AddressSelector'
import { HubTopBar } from '../../components/HubTopBar'
import { HomeSearchBlock } from '../home/HomeSearchBlock'

/** Stores top — Figma 77303:218310 (address bar + search, no hero promo). */
export function StoresTopBlock() {
  return (
    <header className="stores-top bolt-font-base w-full max-w-full min-w-0 shrink-0" data-node-id="77303:218310">
      <HubTopBar>
        <AddressSelector withGutter={false} />
      </HubTopBar>
      <div data-node-id="77303:218312">
        <HomeSearchBlock />
      </div>
    </header>
  )
}
