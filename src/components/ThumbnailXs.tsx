import { design } from '../lib/figmaDesignAssets'

export type ThumbnailXsProps = {
  imageSrc?: string
  line1?: string
  line2?: string
  /** Scaled tile: `--shortcut-scale` from a `.home-viewport-scale` ancestor ({@link HomeScaledCarousel}). */
  variant?: 'default' | 'scaled'
}

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
      <div className="thumbnail-xs-scaled bolt-font-base">
        <div className="thumbnail-xs-scaled__frame">
          <div className="thumbnail-xs-scaled__frame-inner">
            <img alt="" src={imageSrc} className="thumbnail-fill-img" />
          </div>
        </div>
        <p className="thumbnail-xs-scaled__caption bolt-font-body-s-compact-regular">
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
    <div className="bolt-font-base flex w-[86px] shrink-0 flex-col items-center gap-1">
      <div className="relative size-[86px] shrink-0">
        <div className="absolute left-0 top-0 size-[86px] overflow-hidden rounded-xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <img alt="" src={imageSrc} className="thumbnail-fill-img" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start">
        <p className="bolt-font-body-s-regular w-full text-center text-[var(--color-content-primary)]">{line1}</p>
        <div className="flex w-full items-center justify-center gap-1">
          <p className="bolt-font-body-s-regular shrink-0 whitespace-nowrap text-center text-[var(--color-content-primary)]">
            {line2}
          </p>
        </div>
      </div>
    </div>
  )
}
