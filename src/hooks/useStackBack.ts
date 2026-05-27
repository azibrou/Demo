import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBasketFabOptional } from '../context/BasketFabContext'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'
import { shouldResetBasketWhenLeavingPath } from '../lib/eaterNavigation'

/** Back navigation — iOS slide-out on mobile stack, otherwise history -1. */
export function useStackBack() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const stack = useHomeShoppingStack()
  const basket = useBasketFabOptional()

  return useCallback(() => {
    if (basket && shouldResetBasketWhenLeavingPath(pathname)) {
      basket.resetBasket()
    }
    if (stack?.requestSlideOutClose) {
      stack.requestSlideOutClose()
      return
    }
    navigate(-1)
  }, [stack, navigate, basket, pathname])
}
