import { useState } from 'react'
import { KalepIcon } from './KalepIcon'

export type AccountButtonElevation = 'default' | 'scrolled'

export type AccountButtonProps = {
  /** @deprecated Use user icon style (Figma 79413:251183). Kept for call sites that still pass a letter. */
  initial?: string
  variant?: 'user' | 'initial' | 'icon'
  iconSrc?: string
  /** Figma 79413:251183 — top; 79413:251186 — scrolled (stronger shadow). */
  elevation?: AccountButtonElevation
  /** Play a slight bounce once on first mount (Figma home load). */
  bounceOnMount?: boolean
  ariaLabel?: string
  onClick?: () => void
  className?: string
  'data-node-id'?: string
}

const focusRing = 'outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2'

/**
 * Figma [Eater] Avatar - initial — 79413:251183 (default) / 79413:251186 (scrolled).
 * 40×40 white disc, 24×24 user outline icon, elevation shadow transitions on scroll.
 */
export function AccountButton({
  variant = 'user',
  iconSrc,
  initial = 'T',
  elevation = 'default',
  bounceOnMount = false,
  ariaLabel = 'Account',
  onClick,
  className = '',
  'data-node-id': dataNodeId,
}: AccountButtonProps) {
  const [bounce, setBounce] = useState(bounceOnMount)

  const resolvedVariant = variant === 'initial' || variant === 'icon' ? variant : 'user'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        'account-button relative size-10 shrink-0 rounded-[20px] bg-[var(--color-layer-floor-1,#fff)] p-2',
        'flex items-center justify-center',
        `account-button--${elevation}`,
        bounce ? 'account-button--bounce-in' : '',
        focusRing,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-name="[Eater] Avatar - initial"
      data-node-id={dataNodeId ?? (elevation === 'scrolled' ? '79413:251186' : '79413:251183')}
      onAnimationEnd={() => setBounce(false)}
    >
      {resolvedVariant === 'icon' && iconSrc ? (
        <span className="relative size-6 shrink-0" aria-hidden>
          <img alt="" src={iconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        </span>
      ) : resolvedVariant === 'initial' ? (
        <span className="bolt-font-body-s-accent text-[var(--color-content-action-primary)]">{initial}</span>
      ) : (
        <KalepIcon name="user-alt-outline" size={24} />
      )}
    </button>
  )
}
