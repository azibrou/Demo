import { useMemo, type CSSProperties } from 'react'
import {
  BASKET_FAB_RESERVE_PX,
  TAB_BAR_ITEM_GAP_PX,
  type BasketFabContextValue,
} from '../context/BasketFabContext'
import { floatingTabBarMotionVars } from '../lib/floatingTabBarLayout'

type UseFloatingTabBarRowChromeArgs = {
  basket: BasketFabContextValue | null
  /** Search / trailing actions reserve (0 when none). */
  actionsReservePx: number
  /** Mount round basket slot (width tweens via `fabReserveWidthPx`). */
  mountRoundBasketSlot?: boolean
  /** Extra gap + fixed slot when wide merchant FAB is collapsed (56px). */
  fixedTrailingReservePx?: number
}

/**
 * Shared row layout tween — pill width tracks `--ftb-trailing-chrome` while the round
 * basket slot eases open/closed via `fabReserveWidthPx` (home + merchant loading).
 */
export function useFloatingTabBarRowChrome({
  basket,
  actionsReservePx,
  mountRoundBasketSlot = false,
  fixedTrailingReservePx = 0,
}: UseFloatingTabBarRowChromeArgs) {
  const fabReserveWidthPx = basket?.fabReserveWidthPx ?? 0

  const roundBasketReservePx = mountRoundBasketSlot
    ? TAB_BAR_ITEM_GAP_PX + (fabReserveWidthPx > 0 ? fabReserveWidthPx : 0)
    : 0

  const trailingChromePx = actionsReservePx + roundBasketReservePx + fixedTrailingReservePx

  const motionVars = useMemo(
    () => floatingTabBarMotionVars(trailingChromePx),
    [trailingChromePx],
  )

  const roundBasketSlotStyle = useMemo((): CSSProperties => {
    const open = fabReserveWidthPx > 0
    return {
      width: open ? BASKET_FAB_RESERVE_PX : 0,
      flexBasis: open ? BASKET_FAB_RESERVE_PX : 0,
    }
  }, [fabReserveWidthPx])

  return {
    motionVars,
    roundBasketSlotStyle,
    fabReserveWidthPx,
    trailingChromePx,
  }
}
