import { design } from '../../lib/figmaDesignAssets'

const MORE_TO_EXPLORE = [
  { id: 'new', label: 'New', image: design.aisles.moreToExplore[0] },
  { id: 'freshly-baked', label: 'Freshly baked', image: design.aisles.moreToExplore[1] },
  { id: 'bolt-favourites', label: 'Bolt favourites', image: design.aisles.moreToExplore[2] },
] as const

const CATEGORY_LABELS = [
  'Breakfast',
  'Fresh & ready',
  'Bakery',
  'Fruits & vegetables',
  'Dairy & eggs',
  'Cheese',
  'Meat & fish',
  'Vegan',
  'Beverages',
  'Energy drinks',
  'Water & flavoured water',
  'Coffee, tea & cocoa',
  'Salty snacks',
  'Sweet snacks',
  'Ice cream',
  'Frozen products',
  'Bio & special nutrition',
  'Instant meals',
  'Sports nutrition',
  'Pantry',
  'Canned goods & preserves',
  'Health & wellbeing',
  'International cuisine',
  'Home care',
  'Home accessories',
  'Personal care',
  'Baby care',
  'Pet care',
  'Beer and cider',
  'Wine',
] as const

function ExploreTile({ label, imageSrc }: { label: string; imageSrc: string }) {
  return (
    <article
      className="relative isolate grid aspect-[124/176] w-[124px] shrink-0 grid-rows-[minmax(0,52fr)_minmax(0,124fr)] overflow-hidden rounded-lg bg-[var(--color-layer-floor-2)]"
      data-name="[Eater] category-tile"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-[rgba(154,110,51,0.08)]"
        aria-hidden
      />
      <div className="relative z-[2] flex min-h-0 min-w-0 items-start bg-[var(--color-layer-floor-2)] px-3 pb-1 pt-2 backdrop-blur-[6px]">
        <p className="bolt-font-body-s-accent min-w-0 max-w-full truncate text-[var(--color-content-primary)]">
          {label}
        </p>
      </div>
      <div className="relative z-[1] min-h-0 min-w-0">
        <img
          alt=""
          src={imageSrc}
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
        />
      </div>
    </article>
  )
}

function CategoryTile({ label, imageSrc }: { label: string; imageSrc: string }) {
  return (
    <article
      className="relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-[var(--color-layer-floor-2)]"
      data-name="[Eater] category-tile"
    >
      <div className="absolute inset-0 z-[3] bg-[rgba(0,45,30,0.06)]" aria-hidden />
      <div className="relative z-[2] flex h-[45px] min-h-[45px] w-full shrink-0 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[var(--color-layer-floor-2)] to-transparent px-2 pb-1 pt-2">
          <p className="bolt-font-body-xs-accent line-clamp-2 min-w-0 text-[var(--color-content-primary)]">
            {label}
          </p>
        </div>
      </div>
      <div className="relative z-[1] aspect-square w-full shrink-0 overflow-hidden">
        <img
          alt=""
          src={imageSrc}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      </div>
    </article>
  )
}

/**
 * Merchant Aisles tab — Figma [77940:95171](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77940-95171).
 */
export function MerchantAislesTab() {
  return (
    <div className="flex flex-col bg-[var(--color-layer-floor-1)]" data-node-id="77940:95171">
      <header
        className="flex flex-col px-6 pb-2 pt-1"
        data-node-id="77940:95177"
        data-name="[Eater] Category Top section"
      >
        <h1 className="bolt-font-heading-m-accent w-full text-[var(--color-content-primary)]">Aisles</h1>
      </header>

      <section
        className="flex flex-col gap-4 px-6 py-4"
        aria-labelledby="merchant-aisles-more-heading"
        data-node-id="77943:96314"
      >
        <h2
          id="merchant-aisles-more-heading"
          className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]"
        >
          More to explore
        </h2>
        <div className="carousel-grid-row--padded -mx-6 flex items-stretch gap-3 overflow-x-auto overscroll-x-contain px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MORE_TO_EXPLORE.map((tile) => (
            <ExploreTile key={tile.id} label={tile.label} imageSrc={tile.image} />
          ))}
        </div>
      </section>

      <section
        className="flex flex-col gap-4 px-6 py-4"
        aria-labelledby="merchant-aisles-categories-heading"
        data-node-id="77943:95843"
      >
        <h2
          id="merchant-aisles-categories-heading"
          className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]"
        >
          Categories
        </h2>
        <div className="grid w-full grid-cols-3 gap-3">
          {CATEGORY_LABELS.map((label, i) => (
            <CategoryTile key={label} label={label} imageSrc={design.aisles.categoryTiles[i]!} />
          ))}
        </div>
      </section>
    </div>
  )
}
