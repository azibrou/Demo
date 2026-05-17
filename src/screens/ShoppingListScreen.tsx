import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ButtonPrimary } from '../components/ButtonPrimary'
import { ListItem } from '../components/ListItem'
import { NavBar, NavBarEditButton } from '../components/NavBar'
import { useBasketFabOptional } from '../context/BasketFabContext'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'
import { design } from '../lib/figmaDesignAssets'

/** `?demo=filled` seeds the list for layout QA; default is empty. */
const s = design.shoppingList
const thumbs = s.rowThumb

type ShoppingRow = {
  id: string
  title: string
  price: string
  image: string
  inBasket: boolean
  basketQty: number
}

const INSPIRATION: { title: string; price: string; image: string }[] = [
  { title: 'Mini Bananas,\u00a0250g', price: '9,00 €', image: thumbs[0]! },
  { title: 'Banana Curd Pancakes, 200g', price: '9,00 €', image: thumbs[1]! },
  { title: 'Frezza, Banana Coffee Drink, 250ml', price: '9,00 €', image: thumbs[2]! },
  { title: 'Little Tom, Pasteurized Banana Milk, 0,2l', price: '9,00 €', image: thumbs[3]! },
  { title: 'Tere, Emma \u200b\u200bBanana Curd Paste, 150g', price: '9,00 €', image: thumbs[4]! },
]

const FILLED_SEED: ShoppingRow[] = [
  { id: '1', title: 'Banana 1 kg', price: '9,00 €', image: thumbs[0]!, inBasket: true, basketQty: 2 },
  { id: '2', title: 'Mini Bananas,\u00a0250g', price: '9,00 €', image: thumbs[1]!, inBasket: false, basketQty: 1 },
  { id: '3', title: 'Banana Curd Pancakes, 200g', price: '9,00 €', image: thumbs[2]!, inBasket: false, basketQty: 1 },
  { id: '4', title: 'Frezza, Banana Coffee Drink, 250ml', price: '9,00 €', image: thumbs[3]!, inBasket: false, basketQty: 1 },
  { id: '5', title: 'Little Tom, Pasteurized Banana Milk, 0,2l', price: '9,00 €', image: thumbs[4]!, inBasket: false, basketQty: 1 },
  { id: '6', title: 'Tere, Emma \u200b\u200bBanana Curd Paste, 150g', price: '9,00 €', image: thumbs[5]!, inBasket: false, basketQty: 1 },
  { id: '7', title: 'Apple-Banana-Strawberry Fruit Mix, 4x100g', price: '9,00 €', image: thumbs[6]!, inBasket: false, basketQty: 1 },
]

function ShoppingListCardDivider() {
  return (
    <div className="relative h-2 w-full shrink-0 overflow-visible">
      <div className="absolute left-0 right-0 top-[-16px] h-10">
        <img alt="" src={s.cardDivider} className="block size-full max-w-none" />
      </div>
    </div>
  )
}

function EmptyListIllustration() {
  return (
    <div className="relative mx-auto h-[148px] w-[200px] shrink-0 overflow-hidden">
      <div className="absolute left-[86px] top-3 size-[61px] overflow-hidden rounded-xl bg-[#f1e2c9]">
        <img
          alt=""
          src={s.emptyChicken}
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] object-cover"
        />
      </div>
      <div className="absolute left-[130px] top-[50px] h-[66px] w-[67px] overflow-hidden rounded-xl bg-[#f6c19c]">
        <img
          alt=""
          src={s.emptySalmon}
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 -rotate-[19deg] object-cover"
        />
      </div>
      <div className="absolute left-1 top-8 flex size-[86px] items-center justify-center">
        <div className="-rotate-[7.6deg] overflow-hidden rounded-xl bg-[#bde4d5] p-0" style={{ width: 77, height: 77 }}>
          <img
            alt=""
            src={s.emptyBro}
            className="h-full w-full scale-110 object-cover"
          />
        </div>
      </div>
      <div className="absolute left-[60px] top-[59px] flex size-[82px] items-center justify-center">
        <div className="rotate-[6.2deg] overflow-hidden rounded-xl bg-[#ffe993]" style={{ width: 74, height: 74 }}>
          <img alt="" src={s.emptyBananas} className="h-full w-full scale-110 object-cover" />
        </div>
      </div>
    </div>
  )
}

export function ShoppingListScreen() {
  const navigate = useNavigate()
  const homeShoppingStack = useHomeShoppingStack()
  const [searchParams] = useSearchParams()
  const demo = searchParams.get('demo')

  const [items, setItems] = useState<ShoppingRow[]>(() =>
    demo === 'filled' ? FILLED_SEED.map((r) => ({ ...r })) : [],
  )
  const [isEditing, setIsEditing] = useState(false)
  const basket = useBasketFabOptional()

  const listBasketUnits = useMemo(
    () => items.reduce((sum, row) => sum + (row.inBasket ? row.basketQty : 0), 0),
    [items],
  )

  const syncListUnitsRef = useRef(basket?.syncShoppingListBasketUnits)
  syncListUnitsRef.current = basket?.syncShoppingListBasketUnits

  useLayoutEffect(() => {
    syncListUnitsRef.current?.(listBasketUnits)
  }, [listBasketUnits])

  /** Avoid inheriting home scroll; otherwise onScroll NavBar reads stale `scrollY` and collapses. */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const onBack = useCallback(() => {
    if (homeShoppingStack?.requestSlideOutClose) {
      homeShoppingStack.requestSlideOutClose()
      return
    }
    navigate(-1)
  }, [homeShoppingStack, navigate])

  const updateRow = useCallback((id: string, fn: (r: ShoppingRow) => ShoppingRow) => {
    setItems((prev) => prev.map((r) => (r.id === id ? fn(r) : r)))
  }, [])

  const removeRow = useCallback((id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const isEmpty = items.length === 0

  return (
    <div className="font-sans min-h-svh w-full bg-white text-[#191f1c]">
      <div className="mx-auto flex min-h-svh w-full max-w-full flex-col sm:max-w-[375px]">
        <NavBar
          title="My list"
          onBack={onBack}
          collapseMode="onScroll"
          endSlot={
            !isEmpty
              ? (layout) => (
                  <NavBarEditButton
                    pressed={isEditing}
                    onClick={() => setIsEditing((v) => !v)}
                    variant={layout === 'small' ? 'small' : 'large'}
                  />
                )
              : undefined
          }
        />

        <main className={`flex flex-1 flex-col ${isEmpty ? '' : 'pb-36'}`}>
          {isEmpty ? (
            <>
              <div className="flex flex-col items-center gap-6 p-6">
                <div className="flex w-full flex-col items-center gap-4">
                  <EmptyListIllustration />
                  <p className="w-full text-center text-base font-normal leading-6 tracking-[-0.176px] text-[#818391]">
                    Your list is blank
                  </p>
                </div>
                <ButtonPrimary
                  type="button"
                  onClick={() => setItems(FILLED_SEED.map((r) => ({ ...r })))}
                  className="w-full max-w-full"
                >
                  Add items
                </ButtonPrimary>
              </div>
              <ShoppingListCardDivider />
              <section className="flex flex-col pt-6" aria-labelledby="inspiration-heading">
                <div className="px-6 pb-1">
                  <h2 id="inspiration-heading" className="text-xl font-semibold leading-[25px] tracking-[-0.34px]">
                    Find some inspiration
                  </h2>
                </div>
                {INSPIRATION.map((row, i) => (
                  <ListItem
                    key={`empty-insp-${i}`}
                    variant="heart"
                    title={row.title}
                    price={row.price}
                    imageSrc={row.image}
                    showDivider={i < INSPIRATION.length - 1}
                    onHeartClick={() => {}}
                  />
                ))}
              </section>
            </>
          ) : (
            <>
              <div className="flex flex-col py-5">
                <div className="px-6">
                  <p className="text-xl font-semibold leading-[25px] tracking-[-0.34px]">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </p>
                </div>
                {items.map((row, index) => {
                  const variant = isEditing ? 'delete' : row.inBasket ? 'added' : 'add'
                  return (
                    <ListItem
                      key={row.id}
                      variant={variant}
                      title={row.title}
                      price={row.price}
                      imageSrc={row.image}
                      basketQty={row.basketQty}
                      showDivider={index < items.length - 1}
                      onAddClick={() =>
                        updateRow(row.id, (r) => ({ ...r, inBasket: true, basketQty: 1 }))
                      }
                      onBasketDecrement={() =>
                        updateRow(row.id, (r) => {
                          if (r.basketQty <= 1) return { ...r, inBasket: false, basketQty: 1 }
                          return { ...r, basketQty: r.basketQty - 1 }
                        })
                      }
                      onBasketIncrement={() =>
                        updateRow(row.id, (r) => ({ ...r, inBasket: true, basketQty: r.basketQty + 1 }))
                      }
                      onDeleteClick={() => removeRow(row.id)}
                    />
                  )
                })}
              </div>
              <ShoppingListCardDivider />
              <section className="flex flex-col pt-6 pb-10" aria-labelledby="inspiration-heading-filled">
                <div className="px-6 pb-1">
                  <h2 id="inspiration-heading-filled" className="text-xl font-semibold leading-[25px] tracking-[-0.34px]">
                    Find some inspiration
                  </h2>
                </div>
                {INSPIRATION.map((row, i) => (
                  <ListItem
                    key={`filled-insp-${i}`}
                    variant="heart"
                    title={row.title}
                    price={row.price}
                    imageSrc={row.image}
                    showDivider={i < INSPIRATION.length - 1}
                    onHeartClick={() => {}}
                  />
                ))}
              </section>
            </>
          )}
        </main>

        {!isEmpty && (
          <div className="fixed bottom-0 left-0 right-0 z-30 w-full border-t border-[rgba(0,45,30,0.07)] bg-white px-6 pb-10 pt-3 sm:left-1/2 sm:max-w-[375px] sm:-translate-x-1/2">
            <ButtonPrimary type="button" onClick={() => {}} className="w-full">
              Add all to basket
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  )
}
