import { createContext, useContext } from 'react'

export type HomeSearchContextValue = {
  openHomeSearch: () => void
  closeHomeSearch: () => void
}

export const HomeSearchContext = createContext<HomeSearchContextValue | null>(null)

export function useHomeSearch() {
  return useContext(HomeSearchContext)
}
