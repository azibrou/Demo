import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { resolveMerchantFloatingTabBarModel } from '../config/merchantFloatingTabBarConfig'
import { MerchantTabProvider, useMerchantTab } from '../context/MerchantTabContext'
import { MERCHANT_FLOATING_TAB_BAR_ITEMS } from '../screens/merchantFloatingTabBarItems'
import { MerchantFTabBar } from './MerchantFTabBar'
import { RestaurantMerchantSearch } from './RestaurantMerchantSearch'

export type MerchantScreenBottomChrome = 'tab-bar' | 'restaurant-search'

type MerchantScreenShellProps = {
  children: ReactNode
  /** Pavlova Viru Keskus — Figma 79562:242428 centered search instead of {@link MerchantFTabBar}. */
  bottomChrome?: MerchantScreenBottomChrome
  /** Pressing the restaurant search chrome (only with `bottomChrome='restaurant-search'`). */
  onRestaurantSearch?: () => void
  /** Pressing the {@link MerchantFTabBar} search action (only with `bottomChrome='tab-bar'`). */
  onSearchClick?: () => void
}

/**
 * Merchant page wrapper — {@link MerchantFTabBar} portaled to `document.body` so it stays
 * viewport-fixed on iOS stack inner routes (transform on the slide panel breaks `position: fixed`).
 */
function MerchantScreenShellInner({
  children,
  bottomChrome = 'tab-bar',
  onRestaurantSearch,
  onSearchClick,
}: MerchantScreenShellProps) {
  const { barItems } = useMemo(
    () => resolveMerchantFloatingTabBarModel(MERCHANT_FLOATING_TAB_BAR_ITEMS),
    [],
  )
  const { activeTabId, setActiveTabId } = useMerchantTab()
  const [portalReady, setPortalReady] = useState(false)
  const useRestaurantSearch = bottomChrome === 'restaurant-search'

  useEffect(() => {
    setPortalReady(true)
    document.documentElement.classList.add('merchant-immersive-active')
    if (useRestaurantSearch) {
      document.documentElement.classList.add('merchant-restaurant-search-active')
    } else {
      document.documentElement.classList.add('merchant-ftb-active')
    }
    return () => {
      document.documentElement.classList.remove(
        'merchant-ftb-active',
        'merchant-restaurant-search-active',
        'merchant-immersive-active',
      )
    }
  }, [useRestaurantSearch])

  useLayoutEffect(() => {
    document.querySelector('.eater-hub-scroll')?.scrollTo(0, 0)
    document.querySelector('.merchant-screen')?.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    document.querySelector('.merchant-screen')?.scrollTo(0, 0)
  }, [activeTabId])

  const bottomChromeNode = useRestaurantSearch ? (
    <div className="restaurant-merchant-search-chrome-portal pointer-events-none fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-visible">
      <div className="pointer-events-auto">
        <RestaurantMerchantSearch onSearchClick={onRestaurantSearch} />
      </div>
    </div>
  ) : (
    <div className="merchant-ftb-chrome pointer-events-none fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-visible">
      <div className="pointer-events-auto">
        <MerchantFTabBar
          items={barItems}
          activeId={activeTabId}
          onTabChange={setActiveTabId}
          ariaLabel="Merchant navigation"
          onSearchClick={onSearchClick}
        />
      </div>
    </div>
  )

  return (
    <>
      {children}
      {portalReady ? createPortal(bottomChromeNode, document.body) : null}
    </>
  )
}

export function MerchantScreenShell({
  children,
  bottomChrome = 'tab-bar',
  onRestaurantSearch,
  onSearchClick,
}: MerchantScreenShellProps) {
  const { barItems } = useMemo(
    () => resolveMerchantFloatingTabBarModel(MERCHANT_FLOATING_TAB_BAR_ITEMS),
    [],
  )
  const initialTabId = barItems[0]?.id ?? 'venue'

  return (
    <MerchantTabProvider initialTabId={initialTabId}>
      <MerchantScreenShellInner
        bottomChrome={bottomChrome}
        onRestaurantSearch={onRestaurantSearch}
        onSearchClick={onSearchClick}
      >
        {children}
      </MerchantScreenShellInner>
    </MerchantTabProvider>
  )
}
