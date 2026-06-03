import { forwardRef } from 'react'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'

export const TAB_ACTION_SIZE_PX = 56

export type TabActionProps = {
  iconSrc: string
  ariaLabel: string
  onClick?: () => void
  className?: string
}

/**
 * Circular tab action — Figma [76315:68795](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76315-68795).
 */
export const TabAction = forwardRef<HTMLButtonElement, TabActionProps>(function TabAction(
  { iconSrc, ariaLabel, onClick, className = '' },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        FLOATING_CHROME_SHADOW_CLASS,
        'flex size-[56px] shrink-0 items-center justify-center rounded-full bg-white outline-none',
        'ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2',
        className,
      ].join(' ')}
      data-name="tab-action"
      data-node-id="76315:68795"
    >
      <span className="floating-tab-bar__icon relative flex size-6 shrink-0 items-center justify-center" aria-hidden>
        <img alt="" src={iconSrc} className="floating-tab-bar__icon-img pointer-events-none block size-6" />
      </span>
    </button>
  )
})
