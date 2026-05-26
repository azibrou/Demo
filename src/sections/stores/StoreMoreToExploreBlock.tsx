import { design } from '../../lib/figmaDesignAssets'

const tiles = [
  { id: 'new', label: 'New', image: design.moreToExplore[0] },
  { id: 'freshly-baked', label: 'Freshly baked', image: design.moreToExplore[1] },
  { id: 'bolt-favourites', label: 'Bolt favourites', image: design.moreToExplore[2] },
] as const

/** Anchor for in-page scroll (e.g. {@link StoreQuickNavBlock} Categories). */
export const STORE_MORE_TO_EXPLORE_BLOCK_ID = 'store-more-to-explore'

/** Stores page block — “More to explore” category tiles (Figma 70394:111443). */
export function StoreMoreToExploreBlock() {
  return (
    <section
      id={STORE_MORE_TO_EXPLORE_BLOCK_ID}
      className="font-sans flex w-full flex-col items-start gap-4 py-3 text-[#191f1c]"
      aria-labelledby="more-to-explore-heading"
    >
      <div className="flex w-full shrink-0 items-center px-6">
        <div className="flex min-w-0 flex-[1_0_0] flex-col items-start justify-center">
          <h2
            id="more-to-explore-heading"
            className="text-[20px] font-semibold leading-[25px] tracking-[-0.34px]"
          >
            More to explore
          </h2>
        </div>
      </div>
      <div className="carousel-grid-row--padded flex w-full shrink-0 items-stretch gap-3 overflow-x-auto overscroll-x-contain px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tiles.map((tile) => (
          <article
            key={tile.id}
            className="relative isolate grid aspect-[124/176] shrink-0 grid-rows-[minmax(0,52fr)_minmax(0,124fr)] overflow-hidden rounded-[8px] bg-white"
          >
            <div className="pointer-events-none absolute inset-0 z-[3] bg-[rgba(154,110,51,0.08)]" aria-hidden />
            <div className="relative z-[2] flex min-h-0 min-w-0 items-start bg-white px-3 pb-1 pt-[12px] backdrop-blur-[6px]">
              <p className="min-w-0 max-w-full truncate text-left text-sm font-semibold leading-5 tracking-[-0.084px]">
                {tile.label}
              </p>
            </div>
            <div className="relative z-[1] min-h-0 min-w-0">
              <img
                alt=""
                src={tile.image}
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
