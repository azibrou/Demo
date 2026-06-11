import { useCallback } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'

/**
 * Navigate within the eater hub. The active order now persists across navigation
 * (the order engine clears only on empty or a confirmed merchant switch).
 */
export function useEaterNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      navigate(to, options)
    },
    [navigate],
  )
}
