import { createContext, useContext } from 'react'

export type HomeShoppingStackContextValue = {
  /** Mobile stack only: animate list off-screen then navigate back. */
  requestSlideOutClose: () => void
}

export const HomeShoppingStackContext = createContext<HomeShoppingStackContextValue | null>(null)

export function useHomeShoppingStack() {
  return useContext(HomeShoppingStackContext)
}
