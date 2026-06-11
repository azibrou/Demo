import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'
import { useOrder } from '../context/OrderContext'
import { design } from '../lib/figmaDesignAssets'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'
import { formatEuro, parsePrice } from '../lib/price'
import { BottomChromeSlide } from './BottomChromeSlide'

const a = design.categoryTabActions

function CircleFab({
  iconSrc,
  label,
  onClick,
}: {
  iconSrc: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        'flex size-14 shrink-0 items-center justify-center rounded-full bg-white outline-none',
        FLOATING_CHROME_SHADOW_CLASS,
        'ring-[var(--color-special-brand-alt,#0c2c1c)]/20 focus-visible:ring-2',
      ].join(' ')}
    >
      <span className="relative size-6 shrink-0" aria-hidden>
        <img alt="" src={iconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      </span>
    </button>
  )
}

export type CategoryTabActionsProps = {
  /** Store this category screen belongs to — basket shows only for its order. */
  providerId: string
  onDashboardClick: () => void
  onSearchClick: () => void
}

/**
 * Category screen floating actions — Figma 80635:177849 (no basket) / 80635:177850 (with basket).
 * Portaled by the screen; stays viewport-fixed above the iOS stack panel.
 */
export function CategoryTabActions({ providerId, onDashboardClick, onSearchClick }: CategoryTabActionsProps) {
  const navigate = useNavigate()
  const order = useOrder()
  const stack = useHomeShoppingStack()
  const chromeExiting = stack?.slidePhase === 'exiting'
  // Mount the portal synchronously so the actions slide in on the navigation commit.
  const portalReady = typeof document !== 'undefined'

  const matches = order.provider != null && order.provider.id === providerId
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

  // Increment nonce on every count change so the counter span is remounted
  // and replays the badge-pop animation — matches WideBasketFab behaviour.
  const [badgeNonce, setBadgeNonce] = useState(0)
  const prevCountRef = useRef(count)
  useEffect(() => {
    if (count > 0 && count !== prevCountRef.current) {
      setBadgeNonce((n) => n + 1)
    }
    prevCountRef.current = count
  }, [count])

  const bar = (
    <div className="category-tab-actions pointer-events-none fixed inset-x-0 bottom-0 z-40 w-full max-w-full">
      <BottomChromeSlide className="pointer-events-auto mx-auto flex w-full max-w-full items-center gap-3 bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.9)] px-6 pb-[calc(12px+env(safe-area-inset-bottom,0px))] pt-3 sm:max-w-[375px]" exiting={chromeExiting}>
        <CircleFab iconSrc={a.dashboard} label="All categories" onClick={onDashboardClick} />

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <CircleFab iconSrc={a.search} label="Search" onClick={onSearchClick} />

          {hasBasket ? (
            <button
              type="button"
              aria-label={`Basket, ${count} items, ${formatEuro(total)}`}
              onClick={() => navigate('/checkout')}
              className={[
                'category-tab-actions__basket flex h-14 min-w-0 flex-1 items-center justify-between rounded-full',
                'bg-[var(--color-bg-action-primary,#2b8659)] py-3 pl-[18px] pr-4 text-white outline-none',
                FLOATING_CHROME_SHADOW_CLASS,
                'ring-[var(--color-special-brand-alt,#0c2c1c)]/20 focus-visible:ring-2',
                'motion-reduce:transition-none',
                basketShown ? 'category-tab-actions__basket--shown' : '',
              ].join(' ')}
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
                key={badgeNonce}
                className="category-tab-actions__badge flex min-h-5 min-w-5 items-center justify-center rounded-[20px] bg-[var(--color-special-brand-alt,#0c2c1c)] px-1.5 py-0.5 bolt-font-body-xs-accent text-white [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1] motion-reduce:animate-none"
                aria-hidden
              >
                {count > 99 ? '99+' : count}
              </span>
            </button>
          ) : null}
        </div>
      </BottomChromeSlide>
    </div>
  )

  if (!portalReady) return null
  return createPortal(bar, document.body)
}
