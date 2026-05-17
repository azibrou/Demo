/**
 * Product carousel — 2.5 tiles visible in the scrollport (2 full + half of the third at the right edge).
 *
 * Tile width is `--carousel-tile-width` on the scrollport shell (`styles.css`):
 * - `.home-product-carousel` — retail snippet (leading gutter + scaled 12px gaps)
 * - `.carousel-grid-scrollport` — demo `CarouselItem` row
 * - `.carousel-grid-row--padded` — More to explore
 *
 * Formula: (scrollport − leading `--home-gutter` − 2 × gap) / {@link CAROUSEL_VISIBLE_COUNT}
 * Only the leading gutter is subtracted so gaps sit between tiles and the third tile still peeks
 * half-wide to the viewport edge; trailing track padding is past the scroll content.
 */
export const CAROUSEL_VISIBLE_COUNT = 2.5
