import { design } from '../lib/figmaDesignAssets'

export type ThumbnailChromeSize = 'm' | 'l'

export type FavoriteProps = {
  size?: ThumbnailChromeSize
  className?: string
  ariaLabel?: string
  onClick?: () => void
}

const save = design.eaterSaveBtn

/**
 * Figma [79589:184146](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=79589-184146)
 * — [Eater] save-btn (M: 20px heart / 40px hit, L: 28px / 52px).
 */
export function Favorite({ size = 'm', className = '', ariaLabel = 'Save restaurant', onClick }: FavoriteProps) {
  return (
    <button
      type="button"
      className={['thumbnail-favorite', `thumbnail-favorite--${size}`, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
      data-name="[Eater}-save-btn"
      data-node-id="79589:184146"
    >
      <span className="thumbnail-favorite__save-btn" aria-hidden data-node-id="79589:184147" data-name="save-btn">
        <span className="thumbnail-favorite__heart-fill" data-name="heart" data-node-id="79589:184148">
          <img
            alt=""
            src={save.heartFill}
            className="thumbnail-favorite__heart-img pointer-events-none block size-full max-w-none object-contain"
          />
        </span>
        <span className="thumbnail-favorite__heart-outline" data-name="heart (outline)" data-node-id="79589:184152">
          <img
            alt=""
            src={save.heartOutline}
            className="thumbnail-favorite__heart-img pointer-events-none block size-full max-w-none object-contain"
          />
        </span>
      </span>
    </button>
  )
}
