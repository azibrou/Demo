import { useEffect, useRef, useState } from 'react'
import { KalepIcon } from './KalepIcon'
import { WideBasketFab } from './WideBasketFab'
import { useHomeSearchWideBasketFab } from '../hooks/useHomeSearchWideBasketFab'
import { useMerchantOrderProvider, useOrder } from '../context/OrderContext'
import { formatEuro, parsePrice } from '../lib/price'

export type RestaurantMerchantSearchProps = {
  onSearchClick?: () => void
  className?: string
}

/**
 * Restaurant merchant bottom chrome — centered "Search" pill (Figma 80638:179452).
 *
 * Adding the first item runs the shared basket interaction: the wide basket FAB
 * appears in the `loading` state (1500ms) then expands to the wide button (150ms,
 * ease-out) while the search pill shrinks to a 56px icon FAB at the same moment.
 * The search + basket group stays centered throughout (total width is constant
 * between the loading and expanded phases, so only the internal swap animates).
 */
export function RestaurantMerchantSearch({ onSearchClick, className = '' }: RestaurantMerchantSearchProps) {
  const order = useOrder()
  const provider = useMerchantOrderProvider()

  const matches = provider != null && order.provider != null && order.provider.id === provider.id
  const count = matches ? order.unitCount : 0
  const total = matches ? order.items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0) : 0

  const { visible, slideIn, state } = useHomeSearchWideBasketFab(count)
  /** Search collapses to a circle only once the basket has finished loading and expands. */
  const basketExpanded = visible && state === 'default'

  // Nonce bumped on every count increment — causes WideBasketFab to remount the
  // counter span and replay the badge-pop bounce animation.
  const [counterPopNonce, setCounterPopNonce] = useState(0)
  const prevCountRef = useRef(count)
  useEffect(() => {
    if (count > 0 && count !== prevCountRef.current) {
      setCounterPopNonce((n) => n + 1)
    }
    prevCountRef.current = count
  }, [count])

  return (
    <div
      className={['restaurant-merchant-search-chrome', className].filter(Boolean).join(' ')}
      data-name="Restaurant search"
      data-node-id="79562:242428"
    >
      <button
        type="button"
        onClick={onSearchClick}
        className={[
          'restaurant-merchant-search motion-reduce:transition-none',
          basketExpanded ? 'restaurant-merchant-search--compact' : '',
        ].join(' ')}
        data-name="Search"
        data-node-id="79562:242429"
        aria-label="Search menu"
      >
        <KalepIcon name="search" size={24} />
        <span className="restaurant-merchant-search__label bolt-font-body-l-regular">Search</span>
      </button>

      {visible ? (
        <div
          className="restaurant-merchant-search__basket-slot"
          data-shown={slideIn ? 'true' : 'false'}
          data-state={state}
        >
          <WideBasketFab
            state={state}
            count={count}
            totalLabel={total > 0 ? formatEuro(total) : ''}
            counterPopNonce={counterPopNonce}
            revealed
          />
        </div>
      ) : null}
    </div>
  )
}
