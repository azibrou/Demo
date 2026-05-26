import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'

/** Back navigation — iOS slide-out on mobile stack, otherwise history -1. */
export function useStackBack() {
  const navigate = useNavigate()
  const stack = useHomeShoppingStack()

  return useCallback(() => {
    if (stack?.requestSlideOutClose) {
      stack.requestSlideOutClose()
      return
    }
    navigate(-1)
  }, [stack, navigate])
}
