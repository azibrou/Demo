import { createContext, useContext } from 'react'

export type HomeShoppingStackCloseTarget = string | number

export type HomeShoppingStackContextValue = {
  /** Mobile stack only: slide the inner screen off, then navigate (default: history -1). */
  requestSlideOutClose: (to?: HomeShoppingStackCloseTarget) => void
}

export const HomeShoppingStackContext = createContext<HomeShoppingStackContextValue | null>(null)

export function useHomeShoppingStack() {
  return useContext(HomeShoppingStackContext)
}
