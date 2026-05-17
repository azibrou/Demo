import { design } from '../lib/figmaDesignAssets'
import type { ThumbnailChromeSize } from './Favorite'

const ratingStar = design.thumbnailM.ratingStar

export type RatingProps = {
  rating: string
  reviews: string
  size?: ThumbnailChromeSize
  className?: string
}

/** Figma 76330:71573 — thumbnail rating badge (M: body-xs, L: body-s). */
export function Rating({ rating, reviews, size = 'm', className = '' }: RatingProps) {
  const starClass = size === 'l' ? 'size-4' : 'size-3'
  const scoreClass = size === 'l' ? 'bolt-font-body-s-accent' : 'bolt-font-body-xs-accent'
  const reviewsClass = size === 'l' ? 'bolt-font-body-s-regular' : 'bolt-font-body-xs-regular'

  return (
    <div
      className={['thumbnail-rating', `thumbnail-rating--${size}`, className].filter(Boolean).join(' ')}
      data-name="Rating badge"
      data-node-id="76330:71573"
    >
      <span className={`relative ${starClass} shrink-0`} aria-hidden data-name="Rating Selected">
        <img
          alt=""
          src={ratingStar}
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
        />
      </span>
      <p className={`${scoreClass} shrink-0 whitespace-nowrap text-[var(--color-content-primary)]`}>{rating}</p>
      <p className={`${reviewsClass} shrink-0 whitespace-nowrap text-[var(--color-content-primary)]`}>{reviews}</p>
    </div>
  )
}
