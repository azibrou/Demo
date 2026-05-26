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
  avatarInitial = 'T',
  onAddressClick,
  onAvatarClick,
  withGutter = true,
}: AddressSelectorProps) {
  const addressBody = (
    <>
      <div className="flex shrink-0 items-center justify-center">
        <div className="relative size-5 shrink-0" data-name="icon">
          <img
            alt=""
            src={as.locationPin}
            className="pointer-events-none absolute top-0 left-0.5 block h-full w-[18px] max-w-none"
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
        'address-selector bolt-font-base flex w-full items-center gap-2 py-3',
        withGutter ? 'home-gutter-inline' : '',
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

      <button
        type="button"
        onClick={onAvatarClick}
        aria-label="Account"
        className={`relative size-12 shrink-0 bg-transparent ${focusRing}`}
        data-name="[Eater] Avatar - initial"
      >
        <img alt="" src={as.avatarRing} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        <div className="absolute inset-[4.55%] flex flex-col items-center justify-center rounded-full bg-[var(--color-bg-action-secondary)] p-2">
          <p className="bolt-font-heading-xs-accent text-[var(--color-content-action-primary)]">{avatarInitial}</p>
        </div>
      </button>
    </div>
  )
}
