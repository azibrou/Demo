import { design } from '../lib/figmaDesignAssets'

export type ThumbnailXsProps = {
  imageSrc?: string
  line1?: string
  line2?: string
  /** Scaled column: `--shortcut-scale` from `HomeCarouselRow` (`home-viewport-scale`). */
  variant?: 'default' | 'scaled'
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/** Figma 74916:29832 — XS thumb (86×86) + caption; `variant="scaled"` matches shortcuts row scaling. */
export function ThumbnailXs({
  imageSrc = design.eaterHome.thumbnailXs,
  line1 = 'Raw Garden',
  line2 = 'Hariduse',
  variant = 'default',
}: ThumbnailXsProps) {
  if (variant === 'scaled') {
    const showSecondLine = line2 != null && line2 !== ''
    return (
      <div className="thumbnail-xs-scaled">
        <div className="thumbnail-xs-scaled__frame">
          <div className="thumbnail-xs-scaled__frame-inner">
            <img alt="" src={imageSrc} className="thumbnail-xs-scaled__img" />
          </div>
        </div>
        <p className="thumbnail-xs-scaled__caption">
          {line1}
          {showSecondLine ? (
            <>
              <br />
              {line2}
            </>
          ) : null}
        </p>
      </div>
    )
  }

  return (
    <div className={`flex w-[86px] shrink-0 flex-col items-center gap-1 ${labelLeading}`}>
      <div className="relative size-[86px] shrink-0">
        <div className="absolute left-0 top-0 size-[86px] overflow-hidden rounded-xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <img
              alt=""
              src={imageSrc}
              className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
              style={{ width: '188.37%', height: '188.37%' }}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start">
        <p className="w-full text-center text-sm font-normal leading-5 tracking-[-0.084px] text-[#191f1c]">{line1}</p>
        <div className="flex w-full items-center justify-center gap-1">
          <p className="shrink-0 whitespace-nowrap text-center text-sm font-normal leading-5 tracking-[-0.084px] text-[#191f1c]">
            {line2}
          </p>
        </div>
      </div>
    </div>
  )
}
