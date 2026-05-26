import { createContext, useContext } from 'react'

export type HomeShoppingStackContextValue = {
  /** Mobile stack only: slide the inner screen off, then navigate back. */
  requestSlideOutClose: () => void
}

export const HomeShoppingStackContext = createContext<HomeShoppingStackContextValue | null>(null)

export function useHomeShoppingStack() {
  return useContext(HomeShoppingStackContext)
}
