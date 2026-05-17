import { design } from '../lib/figmaDesignAssets'
import { HomeHorizontalScroll } from './HomeHorizontalScroll'

const items = [
  {
    id: 'discount',
    title: '15% off on everything',
    subtitle: 'on orders over 15 €',
    image: design.miniBanner[0],
    wide: false,
  },
  {
    id: 'delivery',
    title: '0,00 € instant delivery',
    subtitle: 'on orders over 15 €',
    image: design.miniBanner[1],
    wide: false,
  },
  {
    id: 'promo',
    title: 'Order 2 fish and chips',
    subtitle: 'get a Coca-Cola as a gift!',
    image: design.miniBanner[2],
    wide: true,
  },
] as const

export function MiniBannerCarousel() {
  return (
    <div className="bolt-font-base w-full pt-3 pb-[4px]" role="region" aria-label="Promotions">
      <HomeHorizontalScroll trackClassName="gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={[
              'flex h-[68px] shrink-0 items-center gap-3 overflow-hidden rounded-[12px] bg-[var(--color-bg-neutral-secondary)] py-3.5 pl-0 pr-0',
              item.wide ? 'w-[327px] min-w-[327px]' : 'min-w-[310px]',
            ].join(' ')}
          >
            <div className="relative h-[68px] w-[52px] shrink-0 overflow-hidden">
              <img
                alt=""
                src={item.image}
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              />
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center text-[var(--color-content-primary)]">
              <p className="bolt-font-body-s-accent">{item.title}</p>
              <p className="bolt-font-body-s-regular">{item.subtitle}</p>
            </div>
          </article>
        ))}
      </HomeHorizontalScroll>
    </div>
  )
}
