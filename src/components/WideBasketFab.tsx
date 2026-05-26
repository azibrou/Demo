import { useNavigate } from 'react-router-dom'
import {
  WIDE_BASKET_FAB_EXPAND_ANCHOR,
  WIDE_BASKET_FAB_EXPAND_DATA_ATTRS,
  WIDE_BASKET_FAB_EXPAND_DIRECTION,
  WIDE_BASKET_FAB_EXPAND_MS,
  WIDE_BASKET_FAB_IN_TAB_BAR_CLASS,
} from '../lib/wideBasketFabExpand'
import { design } from '../lib/figmaDesignAssets'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'

export type WideBasketFabState = 'loading' | 'default' | 'collapsed'

export type WideBasketFabProps = {
  state: WideBasketFabState
  count?: number
  popIn?: boolean
  /** Visible without pop animation (e.g. after reveal, before pop-in frame). */
  revealed?: boolean
  className?: string
  onClick?: () => void
}

function formatCount(count: number) {
  return count > 99 ? '99+' : String(count)
}

function wideBasketFabAriaLabel(state: WideBasketFabState, count: number) {
  if (state === 'loading') return 'Loading basket'
  return count > 0 ? `Basket, ${count} items` : 'Basket'
}

/**
 * Wide merchant basket FAB — Figma 77550:93514 (basket), 77718:108978 (spinner).
 *
 * **Expand direction: ALWAYS right → left (RTL).** Right edge pinned; width grows leftward.
 * In tab bar the basket slot width tweens; standalone uses `.wide-basket-fab-anchor`.
 * Contract: `src/lib/wideBasketFabExpand.ts`
 */
export function WideBasketFab({
  state,
  count = 0,
  popIn = false,
  revealed = false,
  className = '',
  onClick,
}: WideBasketFabProps) {
  const navigate = useNavigate()
  const showCounter = count > 0 && state !== 'loading'
  const label = wideBasketFabAriaLabel(state, count)
  const inTabBar = className.includes(WIDE_BASKET_FAB_IN_TAB_BAR_CLASS)

  const button = (
    <button
      type="button"
      aria-label={label}
      disabled={state === 'loading'}
      data-state={state}
      {...{
        [WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.direction]: WIDE_BASKET_FAB_EXPAND_DIRECTION,
        [WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.anchor]: WIDE_BASKET_FAB_EXPAND_ANCHOR,
      }}
      onClick={onClick ?? (() => navigate('/shopping-list'))}
      className={[
        'wide-basket-fab',
        FLOATING_CHROME_SHADOW_CLASS,
        'bg-[var(--color-bg-action-primary,#2b8659)] outline-none',
        'ring-[var(--color-special-brand-alt,#0c2c1c)]/20 focus-visible:ring-2',
        'motion-reduce:transition-none',
        popIn ? 'wide-basket-fab--pop-in' : revealed ? 'wide-basket-fab--shown' : 'wide-basket-fab--hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={inTabBar ? undefined : { transitionDuration: `${WIDE_BASKET_FAB_EXPAND_MS}ms` }}
    >
      <span className="wide-basket-fab__loader" aria-hidden={state !== 'loading'}>
        <img
          alt=""
          src={design.wideBasketFab.loader}
          className="wide-basket-fab__loader-img motion-reduce:animate-none"
        />
      </span>

      <span className="wide-basket-fab__icon" aria-hidden={state === 'loading'}>
        <img alt="" src={design.wideBasketFab.basket} className="wide-basket-fab__icon-img" />
      </span>

      <span className="wide-basket-fab__label bolt-font-body-m-accent" aria-hidden={state !== 'default'}>
        Basket
      </span>

      {showCounter ? (
        <span
          className={[
            'wide-basket-fab__counter',
            'bolt-font-body-xs-accent [font-feature-settings:"cv03"_1,"cv04"_1]',
            state === 'collapsed' ? 'wide-basket-fab__counter--badge' : '',
          ].join(' ')}
          aria-hidden
        >
          {formatCount(count)}
        </span>
      ) : null}
    </button>
  )

  if (inTabBar) return button

  return <div className="wide-basket-fab-anchor">{button}</div>
}

export const WIDE_BASKET_FAB_STATE_MS = WIDE_BASKET_FAB_EXPAND_MS
export const WIDE_BASKET_FAB_LOADING_MS = 1500
