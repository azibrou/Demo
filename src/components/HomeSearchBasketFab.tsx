import { useBasketFabOptional } from '../context/BasketFabContext'
import { useHomeSearchWideBasketFab } from '../hooks/useHomeSearchWideBasketFab'
import { WideBasketFab } from './WideBasketFab'

/** Centered wide basket FAB on the home search overlay — Figma search quick-add flow. */
export function HomeSearchBasketFab() {
  const basket = useBasketFabOptional()
  const count = basket?.basketDisplayCount ?? 0
  const { visible, slideIn, state, popIn } = useHomeSearchWideBasketFab(count)

  if (!visible) return null

  return (
    <div
      className={[
        'home-search-basket-fab motion-reduce:transition-none',
        slideIn ? 'home-search-basket-fab--shown' : '',
      ].join(' ')}
      data-state={state}
      aria-live="polite"
    >
      <div className="home-search-basket-fab__slot" data-state={state}>
        <WideBasketFab state={state} count={count} popIn={popIn} revealed={slideIn} />
      </div>
    </div>
  )
}
