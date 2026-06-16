import { design } from '../../lib/figmaDesignAssets'

const CATEGORY_LABELS = [
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

function CategoryTile({ label, imageSrc }: { label: string; imageSrc: string }) {
  return (
    <article className="relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white">
      <div className="absolute inset-0 z-[3] bg-[rgba(0,45,30,0.06)]" aria-hidden />
      <div className="relative z-[2] flex h-[45px] min-h-[45px] w-full shrink-0 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-white to-transparent px-3 pb-1 pt-2">
          <p className="min-w-0 line-clamp-2 text-xs font-semibold leading-4 text-[#191f1c]">{label}</p>
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

export function StoreCategoriesBlock() {
  return (
    <section
      className="font-sans flex flex-col gap-4 py-3 text-[#191f1c]"
      aria-labelledby="categories-heading"
    >
      <div className="flex w-full items-center px-6">
        <h2 id="categories-heading" className="text-xl font-semibold leading-[25px] tracking-[-0.34px]">
          Categories
        </h2>
      </div>
      <div className="grid w-full grid-cols-3 gap-3 px-6">
        {CATEGORY_LABELS.map((label, i) => (
          <CategoryTile key={label} label={label} imageSrc={design.categoryTiles[i]!} />
        ))}
      </div>
    </section>
  )
}
