import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASKET_FAB_BUTTON_POP_MS, BASKET_FAB_LOADER_FADE_MS } from '../context/BasketFabContext'
import { useOrderOptional } from '../context/OrderContext'
import { design } from '../lib/figmaDesignAssets'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'

export type BasketFabHomeProps = {
  count: number
  fabReveal: boolean
  fabLoading: boolean
  loaderExiting: boolean
  fabIconPopIn: boolean
  showBadge: boolean
  badgeExiting: boolean
  fabExiting: boolean
  fabPopIn: boolean
  exiting: boolean
  badgePopNonce: number
  /** `home` — hub FloatingTabBar; `merchant` — MerchantFTabBar loading slot (both 56px). */
  size?: 'home' | 'merchant'
}

function basketFabAriaLabel(count: number) {
  return count > 0 ? `Basket, ${count} items` : 'Basket'
}

function basketFabButtonMotionClass(fabExiting: boolean, fabPopIn: boolean, fabReveal: boolean) {
  if (fabExiting) return 'motion-reduce:animate-none basket-fab__button--out'
  if (fabPopIn) return 'motion-reduce:animate-none basket-fab__button--in'
  if (fabReveal) return 'basket-fab__button--shown'
  return 'basket-fab__button--hidden'
}

/**
 * Basket FAB — Figma 77550:93513 (default), 77550:93474 (loading).
 */
export function BasketFabHome({
  count,
  fabReveal,
  fabLoading,
  loaderExiting,
  fabIconPopIn,
  showBadge,
  badgeExiting,
  fabExiting,
  fabPopIn,
  exiting,
  badgePopNonce,
  size = 'home',
}: BasketFabHomeProps) {
  const navigate = useNavigate()
  const order = useOrderOptional()
  const showLoader = fabLoading || loaderExiting
  const showIcon = fabReveal && !showLoader
  const label = basketFabAriaLabel(count)
  const sizeClass = size === 'merchant' ? 'basket-fab--merchant-slot' : 'basket-fab--home'

  /** Home hub FAB opens the merchant the active order belongs to. */
  const handleClick = () => {
    const provider = order?.provider
    if (provider) {
      navigate(provider.path, { state: provider.navState })
      return
    }
    navigate('/checkout')
  }

  return (
    <div
      className={[
        'basket-fab relative shrink-0 origin-center overflow-visible',
        sizeClass,
        fabLoading ? 'basket-fab--loading' : '',
      ].join(' ')}
      style={
        {
          '--basket-fab-loader-fade-ms': `${BASKET_FAB_LOADER_FADE_MS}ms`,
          '--basket-fab-button-pop-ms': `${BASKET_FAB_BUTTON_POP_MS}ms`,
        } as CSSProperties
      }
      data-name="basket-fab"
    >
      <button
        type="button"
        aria-label={label}
        disabled={count <= 0 || exiting || fabLoading}
        onClick={handleClick}
        className={[
          'basket-fab__button relative flex shrink-0 items-center justify-center',
          'bg-[var(--color-bg-action-primary,#2b8659)] outline-none',
          FLOATING_CHROME_SHADOW_CLASS,
          'ring-[var(--color-special-brand-alt,#0c2c1c)]/20 focus-visible:ring-2',
          'origin-center motion-reduce:transition-none',
          basketFabButtonMotionClass(fabExiting, fabPopIn, fabReveal),
        ].join(' ')}
      >
        {showLoader ? (
          <span className="basket-fab__loader relative size-6 shrink-0" aria-hidden>
            <img
              alt=""
              src={design.basketFab.loader}
              className={[
                'pointer-events-none absolute inset-0 block size-full max-w-none object-contain',
                loaderExiting
                  ? 'motion-reduce:animate-none basket-fab__loader--out'
                  : 'motion-reduce:animate-none basket-fab__loader--spin',
              ].join(' ')}
            />
          </span>
        ) : null}
        {showIcon ? (
          <span
            className={[
              'basket-fab__icon relative flex size-6 shrink-0 items-center justify-center',
              fabIconPopIn ? 'motion-reduce:animate-none basket-fab__icon--in' : '',
            ].join(' ')}
            aria-hidden
          >
            <img
              alt=""
              src={design.basketFab.basket}
              className="basket-fab__icon-img pointer-events-none block size-full object-contain"
            />
          </span>
        ) : null}
        {(showBadge || badgeExiting) && count > 0 ? (
          <span
            key={badgeExiting ? 'exit' : badgePopNonce}
            className={[
              'basket-fab__badge absolute right-0 top-0 flex h-5 min-h-5 min-w-5 items-center justify-center rounded-[20px]',
              'bg-[var(--color-special-brand-alt,#0c2c1c)] text-white',
              'bolt-font-body-xs-accent [font-feature-settings:"cv03"_1,"cv04"_1]',
              badgeExiting
                ? 'motion-reduce:animate-none basket-fab__badge--out'
                : 'motion-reduce:animate-none basket-fab__badge--in',
            ].join(' ')}
            aria-hidden
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </button>
    </div>
  )
}
