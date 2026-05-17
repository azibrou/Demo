import { design } from '../lib/figmaDesignAssets'

const heartIcon = design.thumbnailM.heart

export type ThumbnailChromeSize = 'm' | 'l'

export type FavoriteProps = {
  size?: ThumbnailChromeSize
  className?: string
  ariaLabel?: string
  onClick?: () => void
}

/** Figma 76330:71568 — thumbnail save / heart (M: 20px, L: 28px). */
export function Favorite({ size = 'm', className = '', ariaLabel = 'Save restaurant', onClick }: FavoriteProps) {
  return (
    <button
      type="button"
      className={['thumbnail-favorite', `thumbnail-favorite--${size}`, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
      data-name="Favorite"
      data-node-id="76330:71568"
    >
      <span className="thumbnail-favorite__heart" aria-hidden>
        <img alt="" src={heartIcon} className="thumbnail-favorite__heart-img pointer-events-none block max-w-none" />
      </span>
    </button>
  )
}
