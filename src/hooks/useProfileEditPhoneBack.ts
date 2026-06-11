import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeShoppingStack } from '../context/HomeShoppingStackContext'
import { PROFILE_PATH } from '../lib/profileNavigation'

/** Edit phone → Profile only (one level up). */
export function useProfileEditPhoneBack() {
  const navigate = useNavigate()
  const stack = useHomeShoppingStack()

  return useCallback(() => {
    if (stack?.requestSlideOutClose) {
      stack.requestSlideOutClose(PROFILE_PATH)
      return
    }
    navigate(PROFILE_PATH)
  }, [stack, navigate])
}
