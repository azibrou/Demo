import type { CSSProperties } from 'react'
import { BASKET_FAB_RESERVE_PX, type BasketFabContextValue } from '../context/BasketFabContext'
import { BasketFabHome } from './BasketFabHome'

type FloatingTabBarRoundBasketSlotProps = {
  basket: BasketFabContextValue
  style: CSSProperties
  /** `merchant` — same 56px slot as home during loading. */
  size?: 'home' | 'merchant'
}

/** Round 56px basket FAB slot — shared enter/exit width tween (FloatingTabBar + merchant loading). */
export function FloatingTabBarRoundBasketSlot({
  basket,
  style,
  size = 'home',
}: FloatingTabBarRoundBasketSlotProps) {
  return (
    <div className="floating-tab-bar__basket-slot relative shrink-0 overflow-visible" style={style}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2" style={{ width: BASKET_FAB_RESERVE_PX }}>
        <BasketFabHome
          size={size}
          count={basket.basketDisplayCount}
          fabReveal={basket.fabReveal}
          fabLoading={basket.fabLoading}
          loaderExiting={basket.loaderExiting}
          fabIconPopIn={basket.fabIconPopIn}
          showBadge={basket.showBasketBadge}
          badgeExiting={basket.badgeExiting}
          fabExiting={basket.fabExiting}
          fabPopIn={basket.fabPopIn}
          exiting={basket.basketFabExiting}
          badgePopNonce={basket.badgePopNonce}
        />
      </div>
    </div>
  )
}
