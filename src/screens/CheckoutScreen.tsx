import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardDivider } from '../components/CardDivider'
import { CarouselGridItem } from '../components/CarouselGridItem'
import { HomeHorizontalScroll } from '../components/HomeHorizontalScroll'
import { KalepIcon } from '../components/KalepIcon'
import { NavBar } from '../components/NavBar'
import { QuickAddExpandPill } from '../components/QuickAddExpandPill'
import { MerchantOrderProvider, useOrder, type OrderLine } from '../context/OrderContext'
import { useStackBack } from '../hooks/useStackBack'
import { design } from '../lib/figmaDesignAssets'
import { formatEuro, parsePrice } from '../lib/price'

/** Figma 80613:175485 — Balti Uulits checkout */
const c = design.checkout
const carousel = design.carousel

type DeliveryId = 'delivery' | 'pickup' | 'schedule' | 'robot'

const UPSELL = [
  {
    id: 'upsell-salmon',
    variant: 'discount' as const,
    image: c.upsellSalmon,
    title: 'Poke with Salmon',
    priceNow: '11,50 €',
    priceWas: '13,50 €',
    discountLabel: '−25 %',
  },
  {
    id: 'upsell-chicken',
    variant: 'default' as const,
    image: c.upsellChicken,
    title: 'Poke with Chicken',
    price: '12,50 €',
  },
  {
    id: 'upsell-tofu',
    variant: 'default' as const,
    image: c.upsellTofu,
    title: 'Poke with Tofu',
    price: '12,50 €',
  },
  {
    id: 'upsell-salmon-2',
    variant: 'default' as const,
    image: c.upsellSalmon,
    title: 'Poke with salmon',
    price: '1,50 €',
  },
]

const DELIVERY_OPTIONS: {
  id: DeliveryId
  label: string
  subtitle: string
  price?: string
  icon: string
}[] = [
  { id: 'delivery', label: 'Delivery', subtitle: '15-20 min', price: '2,50 €', icon: c.bikeDelivery },
  { id: 'pickup', label: 'Pickup', subtitle: '15-20 min', price: '0,00 €', icon: c.walk },
  { id: 'schedule', label: 'Schedule', subtitle: 'Select time', icon: c.schedule },
  { id: 'robot', label: 'Robot', subtitle: '25-40 min', price: '1,50 €', icon: c.robot },
]

const RECEIPT_ROWS: { label: string; value: string; accent?: boolean; info?: boolean }[] = [
  { label: 'Discount', value: '−7,00 €', info: true },
  { label: 'Packaging fee', value: '1,00 €' },
  { label: 'Subtotal', value: '10,00 €', accent: true },
  { label: 'Small order fee', value: '6,00 €', info: true },
  { label: 'Service fee', value: '0,30 €', info: true },
  { label: 'Tips', value: '0,00 €' },
  { label: 'Delivery fee', value: '1,50 €' },
]

const TIP_OPTIONS = ['No tip', '1,00 €', '2,00 €', '3,00 €']

const DROPOFF_OPTIONS = ['Meet at my door', 'Leave at my door', 'Meet outside']

function RowDivider() {
  return <div className="h-px w-full shrink-0 bg-[rgba(0,45,30,0.07)]" aria-hidden />
}

function RadioButton({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span className="relative block size-6 shrink-0" aria-hidden>
        <img alt="" src={c.radioSelected} className="absolute inset-0 block size-full max-w-none" />
        <img alt="" src={c.radioDot} className="absolute inset-[29.17%] block size-auto max-w-none" />
      </span>
    )
  }
  return (
    <span className="relative block size-6 shrink-0" aria-hidden>
      <img alt="" src={c.radioUnselected} className="absolute inset-0 block size-full max-w-none" />
    </span>
  )
}

function SelectChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 rounded-full px-3 py-2 text-sm leading-5 tracking-[-0.084px]',
        selected
          ? 'bg-[var(--color-bg-action-primary,#2b8659)] font-semibold text-white'
          : 'border border-[rgba(0,45,30,0.07)] bg-white font-normal text-[#191f1c]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function InputPlaceholder({
  label,
  className = '',
  half = false,
}: {
  label: string
  className?: string
  half?: boolean
}) {
  return (
    <div className={`relative h-14 w-full shrink-0 ${className}`}>
      <img alt="" src={half ? c.inputHalf : c.inputFull} className="absolute inset-0 block size-full max-w-none" />
      <p className="absolute left-4 top-4 text-base leading-6 tracking-[-0.176px] text-[#000a07]">{label}</p>
    </div>
  )
}

function OrderItemRow({
  item,
  onIncrement,
  onDecrement,
  showDivider,
}: {
  item: OrderLine
  onIncrement: () => void
  onDecrement: () => void
  showDivider: boolean
}) {
  return (
    <div className="flex w-full flex-col gap-[15px] pt-4">
      <div className="flex gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[rgba(0,45,30,0.06)]">
          {item.image ? <img alt="" src={item.image} className="size-full object-cover" /> : null}
          <div className="absolute inset-0 rounded-xl bg-[rgba(0,45,30,0.06)]" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
          <p className="bolt-font-body-m-regular text-[#191f1c]">{item.title}</p>
          <p className="bolt-font-body-m-regular text-[#191f1c]">{item.price}</p>
        </div>
        <div className="flex w-24 shrink-0 flex-col items-end justify-center">
          <QuickAddExpandPill
            open
            quantity={item.qty}
            plusSrc={carousel.plus}
            minusSrc={carousel.minus}
            onAdd={onIncrement}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            className="w-24"
            quantityClassName="text-base font-normal leading-6 tracking-[-0.176px]"
          />
        </div>
      </div>
      {showDivider ? <RowDivider /> : null}
    </div>
  )
}

export function CheckoutScreen() {
  const onBack = useStackBack()
  const navigate = useNavigate()
  const order = useOrder()
  const items = order.items
  const [delivery, setDelivery] = useState<DeliveryId>('delivery')
  const [tip, setTip] = useState('No tip')
  const [dropoff, setDropoff] = useState(DROPOFF_OPTIONS[0]!)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /** Emptied basket — leave checkout (FAB is already gone). */
  useEffect(() => {
    if (items.length === 0) navigate('/', { replace: true })
  }, [items.length, navigate])

  const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0)
  const title = order.provider?.name ?? 'Basket'

  const handleClear = useCallback(() => {
    order.clear()
    navigate('/', { replace: true })
  }, [order, navigate])

  return (
    <div className="font-sans min-h-svh w-full bg-white text-[#191f1c]">
      <div className="mx-auto flex min-h-svh w-full max-w-full flex-col sm:max-w-[375px]">
        <NavBar
          title={title}
          onBack={onBack}
          collapseMode="fixedSmall"
          endSlot={
            <button
              type="button"
              aria-label="Clear basket"
              onClick={handleClear}
              className="relative grid size-6 shrink-0 place-items-center"
            >
              <KalepIcon name="bin" size={24} />
            </button>
          }
        />

        <main className="flex flex-1 flex-col pb-10">
          <section className="flex flex-col px-6">
            {items.map((item, index) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onIncrement={() => order.increment(item.id)}
                onDecrement={() => order.decrement(item.id)}
                showDivider={index < items.length - 1}
              />
            ))}

            <button
              type="button"
              className="flex w-full items-start gap-3 overflow-hidden pt-4 pb-[15px] text-left"
            >
              <KalepIcon name="bolt-plus-outline" size={24} className="text-[#007042]" />
              <span className="bolt-font-body-m-accent min-w-0 flex-1 text-[#007042]">Add more</span>
            </button>
            <RowDivider />

            <div className="flex flex-col gap-2 py-4">
              <p className="bolt-font-body-s-regular whitespace-pre-wrap text-[#00110b]">
                {`Need cutlery? Napkins? Other? \nLeave a comment...`}
              </p>
            </div>
            <RowDivider />
          </section>

          <section className="flex flex-col gap-4 px-6 py-4">
            <h2 className="bolt-font-heading-s-accent text-[#191f1c]">People also added</h2>
            <MerchantOrderProvider provider={order.provider}>
              <HomeHorizontalScroll aria-label="Suggested items">
                {UPSELL.map((tile) => (
                  <CarouselGridItem
                    key={tile.id}
                    itemId={tile.id}
                    variant={tile.variant}
                    tileWidth="132px"
                    imageSrc={tile.image}
                    title={tile.title}
                    price={tile.price}
                    priceNow={tile.priceNow}
                    priceWas={tile.priceWas}
                    discountLabel={tile.discountLabel}
                  />
                ))}
              </HomeHorizontalScroll>
            </MerchantOrderProvider>
          </section>

          <CardDivider />

          <section className="flex flex-col px-6 py-4">
            <h2 className="bolt-font-heading-xs-accent mb-2.5 text-[#191f1c]">Delivery or pickup?</h2>
            <div className="flex flex-col">
              {DELIVERY_OPTIONS.map((option, index) => (
                <div key={option.id} className="flex flex-col gap-[9px] pt-2.5">
                  <button
                    type="button"
                    onClick={() => setDelivery(option.id)}
                    className="flex w-full items-start justify-center gap-3 text-left"
                  >
                    <span className="relative size-6 shrink-0" aria-hidden>
                      <img alt="" src={option.icon} className="absolute inset-0 block size-full max-w-none" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="bolt-font-body-m-regular text-[#191f1c]">{option.label}</p>
                      <p className="bolt-font-body-s-regular text-[#000a07]">{option.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 self-stretch">
                      {option.price ? (
                        <p className="bolt-font-body-m-regular whitespace-nowrap text-[#191f1c]">{option.price}</p>
                      ) : null}
                      <RadioButton selected={delivery === option.id} />
                    </div>
                  </button>
                  {index < DELIVERY_OPTIONS.length - 1 ? <RowDivider /> : null}
                </div>
              ))}
            </div>
          </section>

          <CardDivider />

          <section className="px-6 py-1">
            <button type="button" className="flex w-full items-start gap-3 py-4 text-left">
              <KalepIcon name="offer-outline" size={24} />
              <span className="bolt-font-body-m-regular min-w-0 flex-1 text-[#191f1c]">Add promo code</span>
              <KalepIcon name="chevron-right" size={24} />
            </button>
          </section>

          <CardDivider />

          <section className="flex flex-col px-6 pt-4">
            <div className="flex flex-col gap-2 pb-3">
              {RECEIPT_ROWS.map((row) => (
                <div key={row.label} className="flex items-start gap-1">
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <p
                      className={[
                        'bolt-font-body-m-regular whitespace-nowrap text-[#191f1c]',
                        row.accent ? 'font-semibold' : '',
                      ].join(' ')}
                    >
                      {row.label}
                    </p>
                    {row.info ? (
                      <span className="relative size-5 shrink-0" aria-hidden>
                        <img alt="" src={c.info} className="absolute inset-0 block size-full max-w-none" />
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={[
                      'bolt-font-body-m-regular shrink-0 whitespace-nowrap text-right text-[#191f1c]',
                      row.accent ? 'font-semibold' : '',
                    ].join(' ')}
                  >
                    {row.label === 'Subtotal' ? formatEuro(subtotal) : row.value}
                  </p>
                </div>
              ))}
              <div className="rounded-lg bg-[#ffb500] px-3 py-2">
                <p className="bolt-font-body-s-regular text-[#191f1c]">1,30 € away from free delivery</p>
              </div>
            </div>
            <RowDivider />
            <div className="flex items-start gap-3 py-4">
              <p className="bolt-font-body-m-accent min-w-0 flex-1 text-[#191f1c]">Total</p>
              <p className="bolt-font-body-m-accent shrink-0 text-right text-[#191f1c]">{formatEuro(subtotal)}</p>
            </div>
          </section>

          <CardDivider />

          <section className="flex flex-col px-6">
            <button type="button" className="flex w-full items-start gap-3 pt-4 pb-[15px] text-left">
              <KalepIcon name="location-pin" size={24} />
              <span className="bolt-font-body-m-regular min-w-0 flex-1 text-[#191f1c]">Vana-Louna 37, Tallinn</span>
              <KalepIcon name="chevron-right" size={24} />
            </button>
            <RowDivider />

            <div className="flex flex-col gap-2 py-4">
              <div className="relative h-[154px] w-full overflow-hidden">
                <img alt="" src={c.map} className="size-full object-cover" />
                <div className="absolute left-1/2 top-[calc(50%-26px)] h-[54px] w-10 -translate-x-1/2 -translate-y-1/2">
                  <img alt="" src={c.pinShadow} className="absolute inset-[94.44%_35%_-1.85%_35%]" />
                  <img alt="" src={c.pinPile} className="absolute inset-[68.52%_45%_0_45%]" />
                  <img alt="" src={c.pinMain} className="absolute inset-[0_0_25.93%_0]" />
                  <img alt="" src={c.pinInner} className="absolute bottom-1/2 left-[32.5%] right-[32.5%] top-[24.07%]" />
                </div>
                <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                  <p className="bolt-font-body-m-regular whitespace-nowrap text-[#191f1c]">Adjust pin</p>
                </div>
              </div>
              <InputPlaceholder label="Apartment, flat or suite number" />
              <div className="flex gap-2">
                <InputPlaceholder label="Entry code" className="flex-1" half />
                <InputPlaceholder label="Floor" className="flex-1" half />
              </div>
              <InputPlaceholder label="Building name" />

              <div className="flex flex-col gap-3 pt-1">
                <p className="bolt-font-body-m-accent text-[#191f1c]">Dropoff instructions*</p>
                <div className="flex flex-wrap gap-2">
                  {DROPOFF_OPTIONS.map((option) => (
                    <SelectChip
                      key={option}
                      label={option}
                      selected={dropoff === option}
                      onClick={() => setDropoff(option)}
                    />
                  ))}
                </div>
                <InputPlaceholder label="Additional note" />
                <p className="bolt-font-body-s-regular pb-4 text-[#000a07]">*Required</p>
              </div>
            </div>
          </section>

          <CardDivider />

          <section className="flex flex-col gap-6 px-6 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="size-6 shrink-0 rounded border-2 border-[#00140d] bg-black" aria-hidden />
                <p className="bolt-font-body-m-regular min-w-0 flex-1 text-[#191f1c]">
                  Share my personal data with Yum! Brands
                </p>
              </div>
              <p className="pl-9 text-base leading-6 text-[#191f1c] underline">Find out why</p>
            </div>
            <div className="flex gap-3">
              <span className="size-6 shrink-0 rounded border-2 border-[#00140d] bg-black" aria-hidden />
              <p className="bolt-font-body-m-regular min-w-0 flex-1 text-[#191f1c]">
                Share my personal data with Yum! Brands
              </p>
            </div>
          </section>

          <CardDivider />

          <section className="flex flex-col gap-4 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="size-24 shrink-0 overflow-hidden">
                <img alt="" src={c.courier} className="size-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="bolt-font-body-m-accent text-[#191f1c]">Tip the courier?</p>
                <p className="bolt-font-body-s-regular text-[#000a07]">
                  The courier will get 100% of your tip. You can cancel the tip later.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TIP_OPTIONS.map((option) => (
                <SelectChip key={option} label={option} selected={tip === option} onClick={() => setTip(option)} />
              ))}
            </div>
          </section>

          <CardDivider />

          <section className="flex flex-col gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ebedef]">
                <img alt="" src={c.loyaltyLogo} className="h-10 w-auto max-w-[80%] object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="bolt-font-body-m-accent text-[#191f1c]">Loyalty program</p>
                <p className="bolt-font-body-s-regular text-[#000a07]">
                  Get a cashback upon successful delivery, as a discount on your order price.
                </p>
              </div>
            </div>
            <RowDivider />
            <button type="button" className="flex w-full items-start gap-3 pt-4 pb-[15px] text-left">
              <KalepIcon name="bolt-plus-outline" size={24} />
              <span className="bolt-font-body-m-accent min-w-0 flex-1 text-[#007042]">Add loyalty card</span>
            </button>
          </section>

          <CardDivider />

          <section className="flex flex-col gap-4 px-6 pt-4">
            <div className="flex items-start gap-3">
              <p className="bolt-font-heading-xs-accent min-w-0 flex-1 text-[#191f1c]">Total</p>
              <p className="bolt-font-heading-xs-accent shrink-0 text-right text-[#191f1c]">{formatEuro(subtotal)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded bg-[#1a1f71] text-[10px] font-bold text-white">
                  MC
                </div>
                <div className="min-w-0">
                  <p className="bolt-font-body-m-regular text-[#191f1c]">•••• 1692</p>
                  <p className="bolt-font-body-s-accent text-[#007042]">Change</p>
                </div>
              </div>
              <p className="bolt-font-body-m-regular shrink-0 text-[#191f1c]">{formatEuro(subtotal)}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <span className="size-6 shrink-0 rounded border-2 border-[#00140d] bg-black" aria-hidden />
              <p className="bolt-font-body-m-regular min-w-0 flex-1 text-[#191f1c]">
                Cash order. I accept that courier may not have change
              </p>
            </div>
          </section>

          <div className="sticky bottom-0 z-20 mt-4 bg-white pt-3">
            <RowDivider />
            <div className="px-6 py-3">
              <button
                type="button"
                className="relative h-14 w-full shrink-0 overflow-hidden rounded-full bg-[#2b8659]"
              >
                <span className="absolute left-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
                  <KalepIcon name="join-arrow" size={24} />
                </span>
                <span className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 flex-col items-center text-center text-white">
                  <span className="text-lg font-semibold leading-[22px] tracking-[-0.252px]">Place order</span>
                  <span className="text-xs leading-4">Slide to confirm</span>
                </span>
              </button>
            </div>
            <div className="pointer-events-none flex h-[34px] items-end justify-center pb-2" aria-hidden>
              <div className="h-[5px] w-[134px] rounded-full bg-black/20" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
