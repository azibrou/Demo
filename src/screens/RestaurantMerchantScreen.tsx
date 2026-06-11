import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { CarouselItem } from '../components/CarouselItem'
import { MiniBannerCarousel } from '../components/MiniBannerCarousel'
import { SimpleItem } from '../components/SimpleItem'
import { TopSectionRestaurant } from '../components/TopSectionRestaurant'
import { miniBannerCarouselItems } from '../lib/miniBannerCarouselContent'
import {
  resolveRestaurantContent,
  restaurantAssortment,
} from '../lib/restaurantMerchantContent'
import {
  isPavlovaViruKeskusRestaurant,
  resolveRestaurantMerchantProvider,
} from '../lib/merchantNavigation'
import { MerchantScreenShell } from '../components/MerchantScreenShell'
import { ProductSheet, type ProductSheetProduct } from '../components/ProductSheet'
import { RestaurantSearchOverlay } from '../components/RestaurantSearchOverlay'
import { MerchantOrderProvider } from '../context/OrderContext'
import { IL_FORNO_NAME } from '../lib/ilFornoMerchantContent'
import { restaurantOrderProviderRef } from '../lib/orderProvider'
import { useStackBack } from '../hooks/useStackBack'
import { StoreCardDividerBlock } from '../sections/stores/StoreCardDividerBlock'

export function RestaurantMerchantScreen() {
  const onBack = useStackBack()
  const location = useLocation()
  const provider = useMemo(() => resolveRestaurantMerchantProvider(location.state), [location.state])
  const orderProvider = useMemo(
    () => restaurantOrderProviderRef(location.state),
    [location.state],
  )
  const content = useMemo(() => resolveRestaurantContent(provider.name), [provider.name])
  const assortment = useMemo(() => restaurantAssortment(content), [content])
  /** Restaurants that use the centered search chrome + search overlay instead of the tab bar. */
  const searchChrome =
    isPavlovaViruKeskusRestaurant(provider.name) || provider.name === IL_FORNO_NAME
  const [searchOpen, setSearchOpen] = useState(false)
  const [detailProduct, setDetailProduct] = useState<ProductSheetProduct | null>(null)

  const openDetails = (item: { id: string; title: string; description?: string; price: string; imageSrc?: string }) =>
    setDetailProduct({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.imageSrc,
    })

  return (
    <MerchantOrderProvider provider={orderProvider}>
    <MerchantScreenShell
      bottomChrome={searchChrome ? 'restaurant-search' : 'tab-bar'}
      onRestaurantSearch={searchChrome ? () => setSearchOpen(true) : undefined}
    >
    <div
      className={[
        'merchant-screen bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-0)] text-[var(--color-content-primary)]',
        searchChrome
          ? 'merchant-screen--restaurant-search pb-[calc(68px+env(safe-area-inset-bottom,0px))]'
          : 'pb-[calc(env(safe-area-inset-bottom,0px)+96px)]',
      ].join(' ')}
    >
      <div className="flex flex-col">
        <TopSectionRestaurant provider={provider} onBack={onBack} />

        <div className="flex flex-col gap-0.5 pb-4" data-node-id="77237:146390">
          <MiniBannerCarousel items={miniBannerCarouselItems} />
          <p className="home-gutter-inline pt-2.5 bolt-font-body-s-regular text-[var(--color-content-primary)]">
            {content.description}
          </p>
        </div>

        <StoreCardDividerBlock />

        <CarouselItem title={content.carouselTitle}>
          {content.popular.map((product) => (
            <CarouselGridItem key={product.id} itemId={product.id} {...product} />
          ))}
        </CarouselItem>

        <section className="pt-6" data-node-id="77237:146411">
          <h2 className="home-gutter-inline bolt-font-heading-xs-accent mb-6 text-[var(--color-content-primary)]">
            Popular
          </h2>
          <SimpleItem
            itemId={content.featured.id}
            {...content.featured}
            nodeId="77237:157189"
            onOpenDetails={() => openDetails(content.featured)}
          />
        </section>

        {content.sections.map((section, sectionIndex) => (
          <section key={section.id} className="pt-6" data-node-id={`77237:146415-${section.id}`}>
            <h2 className="home-gutter-inline bolt-font-heading-xs-accent mb-0 text-[var(--color-content-primary)]">
              {section.title}
            </h2>
            {section.items.map((item, itemIndex) => (
              <SimpleItem
                key={item.id}
                itemId={item.id}
                {...item}
                showDivider={itemIndex < section.items.length - 1}
                onOpenDetails={() => openDetails(item)}
              />
            ))}
            {sectionIndex < content.sections.length - 1 ? <StoreCardDividerBlock /> : null}
          </section>
        ))}
      </div>
    </div>
    </MerchantScreenShell>
    {searchOpen ? (
      <RestaurantSearchOverlay assortment={assortment} onClose={() => setSearchOpen(false)} />
    ) : null}
    {detailProduct ? (
      <ProductSheet
        product={detailProduct}
        provider={orderProvider}
        onClose={() => setDetailProduct(null)}
      />
    ) : null}
    </MerchantOrderProvider>
  )
}
