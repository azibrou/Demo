import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'
import { getProfileOriginHubPath } from '../lib/profileNavigation'

/** Profile → hub tab the user opened Profile from. */
export function useProfileBack() {
  const navigate = useNavigate()
  const stack = useHomeShoppingStack()

  return useCallback(() => {
    const origin = getProfileOriginHubPath()
    if (stack?.requestSlideOutClose) {
      stack.requestSlideOutClose(origin)
      return
    }
    navigate(origin)
  }, [stack, navigate])
}
