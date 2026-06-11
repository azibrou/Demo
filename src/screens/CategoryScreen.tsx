import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { CategoryBottomSheet } from '../components/CategoryBottomSheet'
import { CategorySearchScreen } from '../components/CategorySearchScreen'
import { CategorySheet } from '../components/CategorySheet'
import { CategoryTab } from '../components/CategoryTab'
import { CategoryTabActions } from '../components/CategoryTabActions'
import { KalepIcon } from '../components/KalepIcon'
import { NavBar } from '../components/NavBar'
import { SubcategoryTab } from '../components/SubcategoryTab'
import { useStackBack } from '../hooks/useStackBack'
import { resolveBoltMarketCategoryProducts } from '../lib/boltMarketCategoryContent'
import { categoryScreenProducts } from '../lib/categoryScreenContent'
import {
  MERCHANT_AISLES_CATEGORIES,
  findMerchantAislesCategory,
  merchantAislesSubcategories,
} from '../lib/merchantAislesCategories'
import { resolveStoreMerchantProvider } from '../lib/merchantNavigation'
import { storeOrderProviderRef } from '../lib/orderProvider'
import { MerchantOrderProvider } from '../context/OrderContext'
import { storeMerchantProvider } from '../lib/storeMerchantContent'

function subcategoryKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Category product grid — Figma 80613:192257.
 */
export function CategoryScreen() {
  const onBack = useStackBack()
  const navigate = useNavigate()
  const location = useLocation()
  const { categoryId: categoryIdParam } = useParams<{ categoryId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const merchantName = useMemo(() => {
    const provider = resolveStoreMerchantProvider(location.state)
    return provider.name ?? storeMerchantProvider.name
  }, [location.state])

  const orderProvider = useMemo(() => storeOrderProviderRef(location.state), [location.state])

  const initialCategoryId =
    categoryIdParam && findMerchantAislesCategory(categoryIdParam)
      ? categoryIdParam
      : MERCHANT_AISLES_CATEGORIES[0]!.id

  const [categoryId, setCategoryId] = useState(initialCategoryId)

  const subcategories = useMemo(() => merchantAislesSubcategories(categoryId), [categoryId])
  const subParam = searchParams.get('sub')
  const initialSubId = subParam && subcategories.some((s) => subcategoryKey(s) === subParam)
    ? subParam
    : subcategoryKey(subcategories[0] ?? 'All')

  const [subcategoryId, setSubcategoryId] = useState(initialSubId)
  const [sheet, setSheet] = useState<'none' | 'categories' | 'search'>('none')

  const activeSubcategoryLabel = useMemo(() => {
    return subcategories.find((s) => subcategoryKey(s) === subcategoryId) ?? subcategories[0] ?? 'All'
  }, [subcategories, subcategoryId])

  const products = useMemo(
    () =>
      resolveBoltMarketCategoryProducts(categoryId, activeSubcategoryLabel) ??
      categoryScreenProducts(activeSubcategoryLabel),
    [categoryId, activeSubcategoryLabel],
  )

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const onCategoryChange = useCallback(
    (id: string) => {
      setCategoryId(id)
      const nextSubs = merchantAislesSubcategories(id)
      const firstSub = subcategoryKey(nextSubs[0] ?? 'All')
      setSubcategoryId(firstSub)
      navigate(`/category/${id}?sub=${firstSub}`, {
        replace: true,
        state: location.state,
      })
    },
    [location.state, navigate],
  )

  const onSubcategoryChange = useCallback(
    (id: string) => {
      setSubcategoryId(id)
      setSearchParams({ sub: id }, { replace: true })
    },
    [setSearchParams],
  )

  return (
    <div className="category-screen bolt-font-base min-h-svh w-full bg-[var(--color-layer-floor-1)] text-[var(--color-content-primary)]">
      <div className="mx-auto flex min-h-svh w-full max-w-full flex-col sm:max-w-[375px]">
        <div className="sticky top-0 z-20 bg-[var(--color-layer-floor-1)]">
          <NavBar title={merchantName} onBack={onBack} collapseMode="fixedSmall" />
          <CategoryTab
            categories={MERCHANT_AISLES_CATEGORIES}
            activeId={categoryId}
            onChange={onCategoryChange}
          />
          <SubcategoryTab
            subcategories={subcategories}
            activeId={subcategoryId}
            onChange={onSubcategoryChange}
          />
        </div>

        <main className="flex flex-1 flex-col gap-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+96px)]">
          <header className="flex items-start gap-3 px-6 pb-1">
            <h1 className="bolt-font-heading-xs-accent min-w-0 flex-1 text-[var(--color-content-primary)]">
              {activeSubcategoryLabel}
            </h1>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 rounded pt-[5px] bolt-font-body-s-accent text-[var(--color-content-primary)]"
            >
              All
              <KalepIcon name="chevron-right" size={24} />
            </button>
          </header>

          <MerchantOrderProvider provider={orderProvider}>
            <div className="grid grid-cols-2 gap-[15px] px-6">
              {products.map((product) => (
                <CarouselGridItem key={product.id} itemId={product.id} tileWidth="100%" {...product} />
              ))}
            </div>
          </MerchantOrderProvider>
        </main>
      </div>

      <CategoryTabActions
        providerId={orderProvider.id}
        onDashboardClick={() => setSheet('categories')}
        onSearchClick={() => setSheet('search')}
      />

      {sheet === 'categories' ? (
        <CategoryBottomSheet ariaLabel="All categories" onClose={() => setSheet('none')}>
          {(close) => (
            <CategorySheet
              onClose={close}
              onSelectCategory={(id) => {
                onCategoryChange(id)
                close()
              }}
            />
          )}
        </CategoryBottomSheet>
      ) : null}

      {sheet === 'search' ? (
        <CategorySearchScreen orderProvider={orderProvider} onClose={() => setSheet('none')} />
      ) : null}
    </div>
  )
}
