import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { CarouselGridItem } from './CarouselGridItem'
import { EaterSearchInput } from './EaterSearchInput'
import { HomeSearchBasketFab } from './HomeSearchBasketFab'
import { KalepIcon } from './KalepIcon'
import { useVisualViewportInset } from '../hooks/useVisualViewportInset'
import { MerchantOrderProvider } from '../context/OrderContext'
import type { OrderProviderRef } from '../lib/orderProvider'
import {
  MERCHANT_AISLES_CATEGORIES,
  merchantAislesSubcategories,
} from '../lib/merchantAislesCategories'
import {
  boltMarketQuerySuggestions,
  searchBoltMarket,
} from '../lib/boltMarketSearch'

const SLIDE_MS = 150
const SLIDE_EASE = 'ease-out'
const OFFSCREEN_Y = '100dvh' as const

/** Top quick rows above the store's aisle categories. */
const TOP_SUGGESTIONS = ['Order again', 'Most popular'] as const

function subcategoryKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type CategorySearchScreenProps = {
  /** Store this search belongs to — added items attribute to it. */
  orderProvider: OrderProviderRef
  onClose: () => void
}

function SuggestionRow({ label, onClick, divider }: { label: string; onClick: () => void; divider: boolean }) {
  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 pt-4 pb-[15px] text-left"
      >
        <span className="bolt-font-body-m-regular min-w-0 flex-1 break-words text-[var(--color-content-primary)]">
          {label}
        </span>
        <KalepIcon name="chevron-right" size={20} />
      </button>
      {divider ? <span className="h-px w-full bg-[var(--color-border-separator)]" aria-hidden /> : null}
    </div>
  )
}

/**
 * Full-screen product search for the category screen — Figma 80678:185740 (initial) /
 * 80678:184283 (typing) / 80678:181960 (results). Slides up; closes on Cancel.
 */
export function CategorySearchScreen({ orderProvider, onClose }: CategorySearchScreenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const closingRef = useRef(false)
  const rafIdsRef = useRef<number[]>([])
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [query, setQuery] = useState('')
  const [offscreen, setOffscreen] = useState(true)
  const [transitionOn, setTransitionOn] = useState(false)

  const hasQuery = query.trim().length > 0
  const results = useMemo(() => searchBoltMarket(query), [query])
  const querySuggestions = useMemo(() => boltMarketQuerySuggestions(query), [query])

  useVisualViewportInset()

  useEffect(() => {
    mountedRef.current = true
    document.documentElement.classList.add('category-search-open')
    return () => {
      mountedRef.current = false
      document.documentElement.classList.remove('category-search-open')
      rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
      rafIdsRef.current = []
    }
  }, [])

  useLayoutEffect(() => {
    setOffscreen(true)
    setTransitionOn(false)
    const outer = requestAnimationFrame(() => {
      const inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setTransitionOn(true)
        setOffscreen(false)
        inputRef.current?.focus({ preventScroll: true })
      })
      rafIdsRef.current.push(inner)
    })
    rafIdsRef.current.push(outer)
    return () => {
      rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
      rafIdsRef.current = []
    }
  }, [])

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCloseRef.current()
      return
    }
    setTransitionOn(true)
    setOffscreen(true)
  }, [])

  const onOverlayTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (e.target !== e.currentTarget) return
    if (!closingRef.current) return
    onCloseRef.current()
  }, [])

  // Tapping a category closes the search and opens that category screen.
  const openCategory = useCallback(
    (categoryId: string) => {
      const firstSub = subcategoryKey(merchantAislesSubcategories(categoryId)[0] ?? 'All')
      navigate(`/category/${categoryId}?sub=${firstSub}`, { state: location.state })
      onCloseRef.current()
    },
    [navigate, location.state],
  )

  const overlayStyle = {
    transform: offscreen ? `translateY(${OFFSCREEN_Y})` : 'translateY(0)',
    transition: transitionOn ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}` : 'none',
  } as CSSProperties

  const overlay = (
    <div
      className="category-search-screen motion-reduce:transition-none"
      style={overlayStyle}
      onTransitionEnd={onOverlayTransitionEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="home-gutter-inline w-full shrink-0 pb-3 pt-[max(12px,env(safe-area-inset-top,0px))]">
        <EaterSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Categories and products"
          inputRef={inputRef}
          autoFocus
          onCancel={requestClose}
        />
      </div>

      <div className="category-search-screen__body flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
        {hasQuery ? (
          <>
            {querySuggestions.length > 0 ? (
              <div className="home-gutter-inline flex w-full flex-col">
                {querySuggestions.map((label, index) => (
                  <SuggestionRow
                    key={label}
                    label={label}
                    onClick={() => setQuery(label)}
                    divider={index < querySuggestions.length - 1}
                  />
                ))}
              </div>
            ) : null}

            <MerchantOrderProvider provider={orderProvider}>
              <div className="grid grid-cols-2 gap-[15px] px-6 pt-4">
                {results.map((product) => (
                  <CarouselGridItem
                    key={product.id}
                    itemId={product.id}
                    tileWidth="100%"
                    imageSrc={product.imageSrc}
                    title={product.title}
                    price={product.price}
                  />
                ))}
              </div>
            </MerchantOrderProvider>

            {results.length === 0 ? (
              <p className="home-gutter-inline bolt-font-body-m-regular pt-6 text-[var(--color-content-secondary)]">
                No products found for “{query.trim()}”.
              </p>
            ) : null}
          </>
        ) : (
          <div className="home-gutter-inline flex w-full flex-col">
            {TOP_SUGGESTIONS.map((label) => (
              <SuggestionRow key={label} label={label} onClick={() => setQuery(label)} divider />
            ))}
            {MERCHANT_AISLES_CATEGORIES.map((category, index) => (
              <SuggestionRow
                key={category.id}
                label={`${category.emoji} ${category.label}`}
                onClick={() => openCategory(category.id)}
                divider={index < MERCHANT_AISLES_CATEGORIES.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      <HomeSearchBasketFab />
    </div>
  )

  return createPortal(overlay, document.body)
}
