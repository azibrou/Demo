import { AddressSelector, type AddressSelectorProps } from '../../components/AddressSelector'
import { design } from '../../lib/figmaDesignAssets'

const hb = design.heroBanner

export type HomeHeroBlockProps = {
  promoTitle?: string
  joinLabel?: string
  onJoinClick?: () => void
} & Pick<AddressSelectorProps, 'line1' | 'line2' | 'avatarInitial' | 'onAddressClick' | 'onAvatarClick'>

/**
 * Figma [76281:33163](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76281-33163) — Hero banner with {@link AddressSelector}.
 */
export function HomeHeroBlock({
  promoTitle = 'Free delivery with Bolt Plus',
  joinLabel = 'Join now',
  onJoinClick,
  line1,
  line2,
  avatarInitial,
  onAddressClick,
  onAvatarClick,
}: HomeHeroBlockProps) {
  return (
    <section
      className="hero-banner bolt-font-base bg-[var(--color-layer-floor-0)]"
      data-name="HeroBanner"
      data-node-id="76281:33163"
    >
      <div className="hero-banner__illustration" data-name="Illustration">
        <img alt="" src={hb.illustration} decoding="async" />
      </div>

      <div className="hero-banner__content">
        <div className="shrink-0">
          <AddressSelector
            withGutter={false}
            line1={line1}
            line2={line2}
            avatarInitial={avatarInitial}
            onAddressClick={onAddressClick}
            onAvatarClick={onAvatarClick}
          />
        </div>

        <div className="hero-banner__promo w-full" data-name="Promo">
          <div className="hero-banner__promo-text min-w-0" data-name="Text">
            <p className="hero-banner__promo-title bolt-font-heading-s-accent text-[var(--color-content-primary)]">
              {promoTitle}
            </p>
            <button
              type="button"
              onClick={onJoinClick}
              className="hero-banner__promo-action flex shrink-0 items-center gap-1 bg-transparent p-0 outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
              data-name="[Eater] Action Button"
            >
              <span className="bolt-font-body-s-accent max-w-full shrink overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-primary)]">
                {joinLabel}
              </span>
              <span className="relative size-5 shrink-0" aria-hidden>
                <img alt="" src={hb.joinNowArrow} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
              </span>
            </button>
          </div>
          <div className="min-w-0 flex-1" aria-hidden data-name="Dummy" />
        </div>
      </div>
    </section>
  )
}
