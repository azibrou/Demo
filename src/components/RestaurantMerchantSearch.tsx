import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KalepIcon } from './KalepIcon'
import { useMerchantOrderProvider, useOrder } from '../context/OrderContext'
import { design } from '../lib/figmaDesignAssets'
import { formatEuro, parsePrice } from '../lib/price'

export type RestaurantMerchantSearchProps = {
  onSearchClick?: () => void
  className?: string
}

/**
 * Restaurant merchant bottom chrome.
 * - No basket — centered "Search" pill (Figma 80638:179452).
 * - With basket — search FAB + green basket button (Figma 80638:179453).
 * The pill smoothly compacts to the round FAB when the order gains items.
 */
export function RestaurantMerchantSearch({ onSearchClick, className = '' }: RestaurantMerchantSearchProps) {
  const navigate = useNavigate()
  const order = useOrder()
  const provider = useMerchantOrderProvider()

  const matches = provider != null && order.provider != null && order.provider.id === provider.id
  const count = matches ? order.unitCount : 0
  const total = matches ? order.items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0) : 0
  const hasBasket = count > 0

  // Pop-in once the basket appears (150ms ease-out, matching the app's FAB motion).
  const [basketShown, setBasketShown] = useState(false)
  useEffect(() => {
    if (!hasBasket) {
      setBasketShown(false)
      return
    }
    const raf = window.requestAnimationFrame(() => setBasketShown(true))
    return () => window.cancelAnimationFrame(raf)
  }, [hasBasket])

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
          hasBasket ? 'restaurant-merchant-search--compact' : '',
        ].join(' ')}
        data-name="Search"
        data-node-id="79562:242429"
        aria-label="Search menu"
      >
        <KalepIcon name="search" size={24} />
        <span className="restaurant-merchant-search__label bolt-font-body-l-regular">Search</span>
      </button>

      {hasBasket ? (
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          aria-label={`Basket, ${count} items, ${formatEuro(total)}`}
          className={[
            'restaurant-merchant-basket motion-reduce:transition-none',
            basketShown ? 'restaurant-merchant-basket--shown' : '',
          ].join(' ')}
          data-node-id="80638:179453"
        >
          <span className="relative size-6 shrink-0" aria-hidden>
            <img
              alt=""
              src={design.wideBasketFab.basket}
              className="pointer-events-none absolute inset-0 block size-full max-w-none"
            />
          </span>
          <span className="bolt-font-body-m-accent shrink-0 whitespace-nowrap text-center [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
            {formatEuro(total)}
          </span>
          <span
            className="flex min-h-5 min-w-5 items-center justify-center rounded-[20px] bg-[var(--color-special-brand-alt,#0c2c1c)] px-1.5 py-0.5 bolt-font-body-xs-accent text-white [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]"
            aria-hidden
          >
            {count > 99 ? '99+' : count}
          </span>
        </button>
      ) : null}
    </div>
  )
}
