import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { resolveMerchantFloatingTabBarModel } from '../config/merchantFloatingTabBarConfig'
import { MerchantTabProvider, useMerchantTab } from '../context/MerchantTabContext'
import { MERCHANT_FLOATING_TAB_BAR_ITEMS } from '../screens/merchantFloatingTabBarItems'
import { MerchantFTabBar } from './MerchantFTabBar'

type MerchantScreenShellProps = {
  children: ReactNode
}

/**
 * Merchant page wrapper — {@link MerchantFTabBar} portaled to `document.body` so it stays
 * viewport-fixed on iOS stack inner routes (transform on the slide panel breaks `position: fixed`).
 */
function MerchantScreenShellInner({ children }: MerchantScreenShellProps) {
  const { barItems } = useMemo(
    () => resolveMerchantFloatingTabBarModel(MERCHANT_FLOATING_TAB_BAR_ITEMS),
    [],
  )
  const { activeTabId, setActiveTabId } = useMerchantTab()
  const [portalReady, setPortalReady] = useState(false)

  useEffect(() => {
    setPortalReady(true)
    document.documentElement.classList.add('merchant-ftb-active', 'merchant-immersive-active')
    return () => {
      document.documentElement.classList.remove('merchant-ftb-active', 'merchant-immersive-active')
    }
  }, [])

  useLayoutEffect(() => {
    document.querySelector('.eater-hub-scroll')?.scrollTo(0, 0)
    document.querySelector('.merchant-screen')?.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    document.querySelector('.merchant-screen')?.scrollTo(0, 0)
  }, [activeTabId])

  const tabBarChrome = (
    <div className="merchant-ftb-chrome pointer-events-none fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-visible">
      <div className="pointer-events-auto">
        <MerchantFTabBar
          items={barItems}
          activeId={activeTabId}
          onTabChange={setActiveTabId}
          ariaLabel="Merchant navigation"
        />
      </div>
    </div>
  )

  return (
    <>
      {children}
      {portalReady ? createPortal(tabBarChrome, document.body) : null}
    </>
  )
}

export function MerchantScreenShell({ children }: MerchantScreenShellProps) {
  const { barItems } = useMemo(
    () => resolveMerchantFloatingTabBarModel(MERCHANT_FLOATING_TAB_BAR_ITEMS),
    [],
  )
  const initialTabId = barItems[0]?.id ?? 'venue'

  return (
    <MerchantTabProvider initialTabId={initialTabId}>
      <MerchantScreenShellInner>{children}</MerchantScreenShellInner>
    </MerchantTabProvider>
  )
}
