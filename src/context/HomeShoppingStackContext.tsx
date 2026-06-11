import { createContext, useContext } from 'react'

export type HomeShoppingStackCloseTarget = string | number

export type HomeShoppingStackSlidePhase = 'entering' | 'open' | 'exiting'

export type HomeShoppingStackContextValue = {
  /** Mobile stack only: slide the inner screen off, then navigate (default: history -1). */
  requestSlideOutClose: (to?: HomeShoppingStackCloseTarget) => void
  /** Current panel slide phase — bottom chrome slides down while `'exiting'`. */
  slidePhase: HomeShoppingStackSlidePhase
}

export const HomeShoppingStackContext = createContext<HomeShoppingStackContextValue | null>(null)

export function useHomeShoppingStack() {
  return useContext(HomeShoppingStackContext)
}
