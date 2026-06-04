import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { CarouselItem } from '../components/CarouselItem'
import { MiniBannerCarousel } from '../components/MiniBannerCarousel'
import { SimpleItem } from '../components/SimpleItem'
import { TopSectionRestaurant } from '../components/TopSectionRestaurant'
import { miniBannerCarouselItems } from '../lib/miniBannerCarouselContent'
import {
  restaurantFeaturedItem,
  restaurantMerchantDescription,
  restaurantMenuSections,
  restaurantPopularProducts,
} from '../lib/restaurantMerchantContent'
import {
  isPavlovaViruKeskusRestaurant,
  resolveRestaurantMerchantProvider,
} from '../lib/merchantNavigation'
import { MerchantScreenShell } from '../components/MerchantScreenShell'
import { useStackBack } from '../hooks/useStackBack'
import { StoreCardDividerBlock } from '../sections/stores/StoreCardDividerBlock'

export function RestaurantMerchantScreen() {
  const onBack = useStackBack()
  const location = useLocation()
  const provider = useMemo(() => resolveRestaurantMerchantProvider(location.state), [location.state])
  const pavlovaSearchChrome = isPavlovaViruKeskusRestaurant(provider.name)

  return (
    <MerchantScreenShell bottomChrome={pavlovaSearchChrome ? 'restaurant-search' : 'tab-bar'}>
    <div
      className={[
        'merchant-screen bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] text-[var(--color-content-primary)]',
        pavlovaSearchChrome
          ? 'merchant-screen--restaurant-search pb-[calc(68px+env(safe-area-inset-bottom,0px))]'
          : 'pb-[calc(env(safe-area-inset-bottom,0px)+96px)]',
      ].join(' ')}
    >
      <div className="flex flex-col">
        <TopSectionRestaurant provider={provider} onBack={onBack} />

        <div className="flex flex-col gap-0.5 pb-4" data-node-id="77237:146390">
          <MiniBannerCarousel items={miniBannerCarouselItems} />
          <p className="home-gutter-inline pt-2.5 bolt-font-body-s-regular text-[var(--color-content-primary)]">
            {restaurantMerchantDescription}
          </p>
        </div>

        <StoreCardDividerBlock />

        <CarouselItem title="Poke Bowl Hariduse">
          {restaurantPopularProducts.map((product) => (
            <CarouselGridItem key={product.id} itemId={product.id} {...product} />
          ))}
        </CarouselItem>

        <section className="pt-6" data-node-id="77237:146411">
          <h2 className="home-gutter-inline bolt-font-heading-xs-accent mb-6 text-[var(--color-content-primary)]">
            Popular
          </h2>
          <SimpleItem {...restaurantFeaturedItem} nodeId="77237:157189" />
        </section>

        {restaurantMenuSections.map((section, sectionIndex) => (
          <section key={section.id} className="pt-6" data-node-id={`77237:146415-${section.id}`}>
            <h2 className="home-gutter-inline bolt-font-heading-xs-accent mb-0 text-[var(--color-content-primary)]">
              {section.title}
            </h2>
            {section.items.map((item, itemIndex) => (
              <SimpleItem
                key={item.id}
                {...item}
                showDivider={itemIndex < section.items.length - 1}
              />
            ))}
            {sectionIndex < restaurantMenuSections.length - 1 ? <StoreCardDividerBlock /> : null}
          </section>
        ))}
      </div>
    </div>
    </MerchantScreenShell>
  )
}
