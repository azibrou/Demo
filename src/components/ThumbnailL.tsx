import { design } from '../lib/figmaDesignAssets'

const eh = design.eaterHome
const ph = design.providerHeader

export type ThumbnailLProps = {
  imageSrc?: string
  title?: string
  deliveryLabel?: string
  etaText?: string
  discountPct?: string | null
  rating?: string
  reviews?: string
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/** Figma 74916:29102 — large list restaurant card (342×208). Hero keeps 342∶156; text/overlays stay fixed size. */
export function ThumbnailL({
  imageSrc = eh.thumbnailL,
  title = 'Poke Bowl Hariduse',
  deliveryLabel = '1,50 €',
  etaText = '15–25 min',
  discountPct = '−25%',
  rating = '4.6',
  reviews = '(200+)',
}: ThumbnailLProps) {
  return (
    <article className={`flex w-full min-w-0 max-w-full flex-col items-start ${labelLeading}`}>
      <div className="flex w-full min-w-0 flex-col items-center gap-2 overflow-hidden">
        <div className="relative aspect-[342/156] w-full shrink-0 overflow-hidden">
          <img
            alt=""
            src={imageSrc}
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
            sizes="(max-width: 390px) 100vw, 342px"
          />
          <div className="absolute right-0 top-0 size-[52px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.16)]">
            <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-[7.14%]" aria-hidden>
                <img alt="" src={eh.thumbHeartOutline} className="absolute inset-0 block size-full max-w-none" />
              </span>
              <span className="absolute inset-[10.71%]" aria-hidden>
                <img alt="" src={eh.thumbHeartFilled} className="absolute inset-0 block size-full max-w-none opacity-0" />
              </span>
            </div>
          </div>
          <div className="absolute bottom-[12px] right-3 flex items-center gap-1 overflow-hidden rounded bg-white px-1.5 py-1">
            <span className="relative size-4 shrink-0" aria-hidden>
              <img alt="" src={eh.thumbRatingStar} className="absolute inset-0 block size-full max-w-none" />
            </span>
            <p className="shrink-0 text-sm font-semibold leading-5 tracking-[-0.084px] text-black">{rating}</p>
            <p className="shrink-0 text-sm font-normal leading-5 tracking-[-0.084px] text-black">{reviews}</p>
          </div>
          {discountPct ? (
            <div className="absolute left-3 top-3 flex items-start">
              <div className="flex items-start overflow-hidden rounded bg-[#de1929] px-2 py-1">
                <p className="shrink-0 whitespace-nowrap text-sm font-semibold leading-5 tracking-[-0.084px] text-white">
                  {discountPct}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-center">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold leading-6 tracking-[-0.252px] text-[#191f1c]">
              {title}
            </p>
          </div>
          <div className="flex w-full items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="relative size-4 shrink-0" aria-hidden>
                  <img alt="" src={ph.bikeDelivery} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
                </span>
                <span className="text-sm font-normal leading-5 tracking-[-0.084px] text-[#191f1c]">{deliveryLabel}</span>
              </div>
              <div className="flex items-center gap-1 overflow-hidden rounded-full">
                <span className="relative size-4 shrink-0" aria-hidden>
                  <img alt="" src={ph.timer} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
                </span>
                <p className="shrink-0 whitespace-nowrap text-sm font-normal leading-5 tracking-[-0.084px] text-[#191f1c]">
                  {etaText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
