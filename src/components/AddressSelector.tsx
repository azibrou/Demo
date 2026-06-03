import { useAccountButtonMountBounce, useHubScrollElevated } from '../context/HubScrollContext'
import { AccountButton } from './AccountButton'
import { design } from '../lib/figmaDesignAssets'

const as = design.addressSelector

export type AddressSelectorProps = {
  line1?: string
  line2?: string
  avatarInitial?: string
  onAddressClick?: () => void
  onAvatarClick?: () => void
  /** When false, parent supplies horizontal inset (e.g. {@link HomeHeroBlock}). */
  withGutter?: boolean
}

/**
 * Figma [76281:33224](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76281-33224) — Address selector.
 */
export function AddressSelector({
  line1 = 'Rotermanni 6',
  line2 = 'Tallinn, Estonia',
  onAddressClick,
  onAvatarClick,
  withGutter = true,
}: AddressSelectorProps) {
  const scrollElevated = useHubScrollElevated()
  const bounceOnMount = useAccountButtonMountBounce()

  const addressBody = (
    <>
      <div className="flex shrink-0 items-center justify-center">
        <div className="relative size-5 shrink-0" data-name="icon">
          <img
            alt=""
            src={as.locationPin}
            className="pointer-events-none absolute top-0 left-[3px] block h-full w-[16px] max-w-none"
          />
        </div>
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col items-start justify-center">
        <p className="bolt-font-body-s-accent break-words text-[var(--color-content-primary)]">{line1}</p>
        <p className="bolt-font-body-xs-regular break-words text-[var(--color-content-secondary)]">{line2}</p>
      </div>
    </>
  )

  const focusRing = 'outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2'

  return (
    <div
      className={[
        'address-selector bolt-font-base flex w-full max-w-full min-w-0 items-center gap-2',
        withGutter ? 'home-gutter-inline py-3' : 'py-0',
      ]
        .filter(Boolean)
        .join(' ')}
      data-name="Address selector"
      data-node-id="76281:33224"
    >
      {onAddressClick ? (
        <button
          type="button"
          onClick={onAddressClick}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-transparent text-left ${focusRing}`}
        >
          {addressBody}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2">{addressBody}</div>
      )}

      <AccountButton
        elevation={scrollElevated ? 'scrolled' : 'default'}
        bounceOnMount={bounceOnMount}
        onClick={onAvatarClick}
      />
    </div>
  )
}
