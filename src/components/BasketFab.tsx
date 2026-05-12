import { useNavigate } from 'react-router-dom'
import { design } from '../lib/figmaDesignAssets'
import { FLOATING_PILL_BOX_SHADOW_CLASS } from '../lib/floatingPillShadow'

const basketSrc = design.basketFab.basket

export type BasketFabProps = {
  count: number
  fabReveal: boolean
  showBadge: boolean
  /** Reverse pop: basket + badge leave together (same keyframes as IN, `reverse`). */
  exiting: boolean
  /** Bumps when the badge should play its entrance pop (after FAB scale-in). */
  badgePopNonce: number
}

/**
 * Basket FAB — Figma node 74934:235482 (green circle, white basket, count badge).
 * `fabReveal`: same keyframes + spring as the counter (`basket-fab-badge-pop` / `--ease-basket-spring`), 150ms via `animate-basket-fab-pop`.
 * Counter runs after (`animate-basket-fab-badge-pop`, 180ms).
 */
export function BasketFab({ count, fabReveal, showBadge, exiting, badgePopNonce }: BasketFabProps) {
  const navigate = useNavigate()
  const label = count > 0 ? `Basket, ${count} items` : 'Basket'

  return (
    <div
      className={[
        'relative size-[60px] shrink-0 origin-center overflow-visible',
        exiting ? 'motion-reduce:animate-none animate-basket-fab-pop-reverse' : '',
      ].join(' ')}
      data-name="basket-fab"
    >
      <button
        type="button"
        aria-label={label}
        disabled={count <= 0 || exiting}
        onClick={() => navigate('/shopping-list')}
        className={[
          'relative flex size-[60px] shrink-0 items-center justify-center rounded-[60px] bg-[#2b8659] p-2.5 outline-none',
          FLOATING_PILL_BOX_SHADOW_CLASS,
          'ring-[#002d1e]/20 focus-visible:ring-2',
          'origin-center motion-reduce:transition-none',
          exiting
            ? 'scale-100 opacity-100'
            : fabReveal
              ? 'motion-reduce:animate-none animate-basket-fab-pop'
              : [
                  'scale-[0.35] opacity-0',
                  'transition-[transform,opacity] duration-[150ms] [transition-timing-function:var(--ease-basket-spring)]',
                ].join(' '),
        ].join(' ')}
      >
        <span className="relative size-6 shrink-0" aria-hidden>
          <img alt="" src={basketSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        </span>
        {showBadge && count > 0 ? (
          <span
            key={exiting ? 'exit' : badgePopNonce}
            className={[
              'absolute left-10 top-px flex h-5 min-w-5 items-center justify-center rounded-[20px] bg-[#0c2c1c] px-1',
              'text-center text-xs font-semibold leading-[15px] text-white',
              '[font-feature-settings:"cv03"_1,"cv04"_1]',
              exiting ? '' : 'motion-reduce:animate-none animate-basket-fab-badge-pop',
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
