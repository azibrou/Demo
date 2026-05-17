import { useNavigate } from 'react-router-dom'
import { design } from '../lib/figmaDesignAssets'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'

const basketSrc = design.basketFab.basket

export type BasketFabProps = {
  count: number
  fabReveal: boolean
  showBadge: boolean
  badgeExiting: boolean
  fabExiting: boolean
  fabPopIn: boolean
  /** True for the full staged exit (keeps slot mounted). */
  exiting: boolean
  /** Bumps when the badge should play its entrance pop. */
  badgePopNonce: number
}

/**
 * Basket FAB — Figma 76330:68863 (icon), 74934:235482 (FAB).
 * Enter: tab compact → FAB pop → badge pop. Exit runs the same steps in reverse.
 */
export function BasketFab({
  count,
  fabReveal,
  showBadge,
  badgeExiting,
  fabExiting,
  fabPopIn,
  exiting,
  badgePopNonce,
}: BasketFabProps) {
  const navigate = useNavigate()
  const label = count > 0 ? `Basket, ${count} items` : 'Basket'

  return (
    <div
      className={[
        'basket-fab relative size-[60px] shrink-0 origin-center overflow-visible',
        exiting ? 'motion-reduce:animate-none basket-fab--exiting' : '',
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
          FLOATING_CHROME_SHADOW_CLASS,
          'ring-[#002d1e]/20 focus-visible:ring-2',
          'origin-center motion-reduce:transition-none',
          fabExiting
            ? 'motion-reduce:animate-none basket-fab__button--out'
            : fabPopIn
              ? 'motion-reduce:animate-none basket-fab__button--in'
              : fabReveal
                ? 'basket-fab__button--shown'
                : 'basket-fab__button--hidden',
        ].join(' ')}
      >
        <span className="relative size-6 shrink-0" aria-hidden>
          <img alt="" src={basketSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        </span>
        {(showBadge || badgeExiting) && count > 0 ? (
          <span
            key={badgeExiting ? 'exit' : badgePopNonce}
            className={[
              'absolute left-10 top-px flex h-5 min-w-5 items-center justify-center rounded-[20px] bg-[#0c2c1c] px-1',
              'text-center text-xs font-semibold leading-[15px] text-white',
              '[font-feature-settings:"cv03"_1,"cv04"_1]',
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
