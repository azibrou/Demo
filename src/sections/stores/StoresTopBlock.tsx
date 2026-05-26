import { AddressSelector } from '../../components/AddressSelector'
import { HomeSearchBlock } from '../home/HomeSearchBlock'

/** Stores top — Figma 77303:218310 (address bar + search, no hero promo). */
export function StoresTopBlock() {
  return (
    <header className="stores-top bolt-font-base w-full shrink-0" data-node-id="77303:218310">
      <div
        className="stores-top__bar bg-gradient-to-b from-[var(--color-layer-floor-0)] to-transparent"
        data-node-id="77303:219458"
      >
        <AddressSelector />
      </div>
      <div data-node-id="77303:218312">
        <HomeSearchBlock />
      </div>
    </header>
  )
}
