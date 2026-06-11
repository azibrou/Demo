import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { OrderProviderRef } from '../lib/orderProvider'

/** One product in the active order. */
export type OrderLine = {
  id: string
  title: string
  price: string
  image?: string
  qty: number
}

/** Input when adding a product (qty handled by the engine). */
export type OrderLineInput = {
  id: string
  title: string
  price: string
  image?: string
}

type OrderState = {
  provider: OrderProviderRef | null
  items: OrderLine[]
}

type PendingSwitch = {
  /** Name of the existing order's merchant (for the dialog copy). */
  existingProviderName: string
  apply: () => void
}

export type OrderContextValue = {
  provider: OrderProviderRef | null
  items: OrderLine[]
  unitCount: number
  /** Qty of `itemId` only when the active order belongs to `providerId`, else 0. */
  getQtyFor: (providerId: string, itemId: string) => number
  /**
   * Add one unit of `line` attributed to `provider`. When an order already exists for a
   * different provider, opens the "Start a new order?" dialog instead of mutating.
   */
  addOne: (provider: OrderProviderRef, line: OrderLineInput) => void
  increment: (itemId: string) => void
  decrement: (itemId: string) => void
  removeItem: (itemId: string) => void
  clear: () => void
  /** Existing order merchant name while a cross-merchant switch is pending, else null. */
  pendingProviderName: string | null
  confirmSwitch: () => void
  cancelSwitch: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}

export function useOrderOptional() {
  return useContext(OrderContext)
}

function countUnits(items: OrderLine[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}

function normalize(state: OrderState): OrderState {
  if (state.items.length === 0) return { provider: null, items: [] }
  return state
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>({ provider: null, items: [] })
  const [pending, setPending] = useState<PendingSwitch | null>(null)

  const stateRef = useRef(state)
  stateRef.current = state

  const applyAddOne = useCallback((provider: OrderProviderRef, line: OrderLineInput) => {
    setState((prev) => {
      const sameProvider = prev.provider != null && prev.provider.id === provider.id
      const base: OrderState = sameProvider ? prev : { provider, items: [] }
      const idx = base.items.findIndex((item) => item.id === line.id)
      let items: OrderLine[]
      if (idx >= 0) {
        items = base.items.slice()
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 }
      } else {
        items = [...base.items, { id: line.id, title: line.title, price: line.price, image: line.image, qty: 1 }]
      }
      return { provider, items }
    })
  }, [])

  const addOne = useCallback(
    (provider: OrderProviderRef, line: OrderLineInput) => {
      const cur = stateRef.current
      const conflict = cur.provider != null && cur.provider.id !== provider.id && cur.items.length > 0
      if (conflict) {
        setPending({
          existingProviderName: cur.provider!.name,
          apply: () => applyAddOne(provider, line),
        })
        return
      }
      applyAddOne(provider, line)
    },
    [applyAddOne],
  )

  const increment = useCallback((itemId: string) => {
    setState((prev) => {
      const idx = prev.items.findIndex((item) => item.id === itemId)
      if (idx < 0) return prev
      const items = prev.items.slice()
      items[idx] = { ...items[idx], qty: items[idx].qty + 1 }
      return { ...prev, items }
    })
  }, [])

  const decrement = useCallback((itemId: string) => {
    setState((prev) => {
      const idx = prev.items.findIndex((item) => item.id === itemId)
      if (idx < 0) return prev
      const current = prev.items[idx]!
      let items: OrderLine[]
      if (current.qty <= 1) {
        items = prev.items.filter((item) => item.id !== itemId)
      } else {
        items = prev.items.slice()
        items[idx] = { ...current, qty: current.qty - 1 }
      }
      return normalize({ provider: prev.provider, items })
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setState((prev) =>
      normalize({ provider: prev.provider, items: prev.items.filter((item) => item.id !== itemId) }),
    )
  }, [])

  const clear = useCallback(() => {
    setState({ provider: null, items: [] })
  }, [])

  const getQtyFor = useCallback(
    (providerId: string, itemId: string) => {
      if (state.provider == null || state.provider.id !== providerId) return 0
      return state.items.find((item) => item.id === itemId)?.qty ?? 0
    },
    [state],
  )

  const confirmSwitch = useCallback(() => {
    const next = pending
    setPending(null)
    next?.apply()
  }, [pending])

  const cancelSwitch = useCallback(() => {
    setPending(null)
  }, [])

  const unitCount = useMemo(() => countUnits(state.items), [state.items])

  const value = useMemo(
    (): OrderContextValue => ({
      provider: state.provider,
      items: state.items,
      unitCount,
      getQtyFor,
      addOne,
      increment,
      decrement,
      removeItem,
      clear,
      pendingProviderName: pending?.existingProviderName ?? null,
      confirmSwitch,
      cancelSwitch,
    }),
    [
      state.provider,
      state.items,
      unitCount,
      getQtyFor,
      addOne,
      increment,
      decrement,
      removeItem,
      clear,
      pending,
      confirmSwitch,
      cancelSwitch,
    ],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

/** Provider ref for the merchant whose add buttons are rendered inside this subtree. */
const MerchantOrderContext = createContext<OrderProviderRef | null>(null)

export function MerchantOrderProvider({
  provider,
  children,
}: {
  provider: OrderProviderRef | null
  children: ReactNode
}) {
  return <MerchantOrderContext.Provider value={provider}>{children}</MerchantOrderContext.Provider>
}

export function useMerchantOrderProvider() {
  return useContext(MerchantOrderContext)
}
