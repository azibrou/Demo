import { useCallback } from 'react'
import { useLocation, useNavigate, type NavigateOptions } from 'react-router-dom'
import { useBasketFabOptional } from '../context/BasketFabContext'
import { shouldResetBasketOnNavigation } from '../lib/eaterNavigation'

/** Navigate with basket reset before leaving when policy requires it. */
export function useEaterNavigate() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const basket = useBasketFabOptional()

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      if (basket && shouldResetBasketOnNavigation(pathname, to)) {
        basket.resetBasket()
      }
      navigate(to, options)
    },
    [basket, navigate, pathname],
  )
}
