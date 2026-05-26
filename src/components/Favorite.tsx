import { design } from '../lib/figmaDesignAssets'

const heartIcon = design.eaterSaveBtn.heart

export type ThumbnailChromeSize = 'm' | 'l'

export type FavoriteProps = {
  size?: ThumbnailChromeSize
  className?: string
  ariaLabel?: string
  onClick?: () => void
}

/** Figma 77857:525189 — [Eater] save-btn (M: 20px heart / 40px hit, L: 28px / 52px). */
export function Favorite({ size = 'm', className = '', ariaLabel = 'Save restaurant', onClick }: FavoriteProps) {
  return (
    <button
      type="button"
      className={['thumbnail-favorite', `thumbnail-favorite--${size}`, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
      data-name="[Eater}-save-btn"
      data-node-id="77857:525189"
    >
      <span className="thumbnail-favorite__heart" aria-hidden data-node-id="77857:525192">
        <img alt="" src={heartIcon} className="thumbnail-favorite__heart-img pointer-events-none block max-w-none" />
      </span>
    </button>
  )
}
