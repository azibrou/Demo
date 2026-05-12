import { design } from '../lib/figmaDesignAssets'

const ph = design.providerHeader
const eh = design.eaterHome

export type ThumbnailMProps = {
  imageSrc?: string
  title?: string
  deliveryLabel?: string
  etaText?: string
  /** e.g. `4.6` — Figma rating badge */
  ratingText?: string
  /** e.g. `(200+)` — Figma rating badge */
  reviewCountText?: string
  onSaveClick?: () => void
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/** Figma 74916:28992 — medium provider thumb. Hero 105px tall (210∶2); overlays + rating badge; width from parent (e.g. {@link ThumbnailMCarousel} tile). */
export function ThumbnailM({
  imageSrc = design.eaterHome.thumbnailM,
  title = 'Burger Town',
  deliveryLabel = '1,50 €',
  etaText = '15–25 min',
  ratingText = '4.6',
  reviewCountText = '(200+)',
  onSaveClick,
}: ThumbnailMProps) {
  return (
    <div className={`flex w-full min-w-0 max-w-full shrink-0 flex-col gap-1 ${labelLeading}`}>
      <div className="relative h-[105px] w-full shrink-0">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <img
            alt=""
            src={imageSrc}
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            sizes="(max-width: 430px) 30vw, 220px"
          />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 flex size-10 items-center justify-center drop-shadow-[0px_2px_3px_rgba(0,0,0,0.16)]">
          <button
            type="button"
            className="pointer-events-auto relative size-5 shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#191f1c]/25"
            aria-label="Save restaurant"
            onClick={(e) => {
              e.stopPropagation()
              onSaveClick?.()
            }}
          >
            <img
              alt=""
              src={eh.thumbHeartOutline}
              className="pointer-events-none absolute inset-0 block size-full max-w-none"
            />
          </button>
        </div>
        <div className="absolute bottom-1 right-2 flex items-center gap-1 overflow-hidden rounded bg-white px-1.5 py-1">
          <span className="relative size-3 shrink-0" aria-hidden>
            <img alt="" src={eh.thumbRatingStar} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          </span>
          <span className="shrink-0 whitespace-nowrap text-xs font-semibold leading-4 text-[#191f1c]">{ratingText}</span>
          <span className="shrink-0 whitespace-nowrap text-xs font-normal leading-4 text-[#191f1c]">{reviewCountText}</span>
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col items-start">
        <div className="flex w-full min-w-0 items-center">
          <p className="min-w-0 shrink truncate text-base font-semibold leading-6 tracking-[-0.176px] text-[#191f1c]">{title}</p>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2">
          <div className="flex shrink-0 items-center gap-1">
            <span className="relative size-3 shrink-0" aria-hidden>
              <img alt="" src={ph.bikeDelivery} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
            <span className="text-xs font-semibold leading-4 tracking-[-0.084px] text-[rgba(173,0,14,0.94)]">{deliveryLabel}</span>
            <span className="text-xs leading-4 tracking-[-0.084px] text-[rgba(0,10,7,0.63)] [text-decoration-skip-ink:none] line-through">
              3,50 €
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 overflow-hidden rounded-full">
            <span className="relative size-3 shrink-0" aria-hidden>
              <img alt="" src={ph.timer} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
            <p className="shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal leading-4 tracking-[-0.084px] text-[#191f1c]">
              {etaText}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
