import { design } from '../lib/figmaDesignAssets'

const defaultAvatarRing = design.addressSelector.avatarRing

export type AccountButtonProps = {
  /** Letter shown in the avatar disc (`initial` variant). */
  initial?: string
  variant?: 'initial' | 'icon'
  iconSrc?: string
  avatarRingSrc?: string
  ariaLabel?: string
  onClick?: () => void
  className?: string
  'data-node-id'?: string
}

const focusRing = 'outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2'

/**
 * Figma [Eater] Avatar - initial — 48×48 account control with ring asset.
 * Used in {@link AddressSelector}, DineOut top nav, and other eater headers.
 */
export function AccountButton({
  initial = 'T',
  variant = 'initial',
  iconSrc,
  avatarRingSrc = defaultAvatarRing,
  ariaLabel = 'Account',
  onClick,
  className = '',
  'data-node-id': dataNodeId,
}: AccountButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={['relative size-12 shrink-0 bg-transparent', focusRing, className].filter(Boolean).join(' ')}
      data-name="[Eater] Avatar - initial"
      data-node-id={dataNodeId}
    >
      <img alt="" src={avatarRingSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      <div
        className={[
          'absolute inset-[4.55%] flex flex-col items-center justify-center rounded-full p-2',
          variant === 'initial' ? 'bg-[var(--color-bg-action-secondary)]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {variant === 'icon' && iconSrc ? (
          <span className="relative size-5 shrink-0" aria-hidden>
            <img alt="" src={iconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          </span>
        ) : (
          <p className="bolt-font-heading-xs-accent text-[var(--color-content-action-primary)]">{initial}</p>
        )}
      </div>
    </button>
  )
}
