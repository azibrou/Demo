import { createContext, useContext, useState, type ReactNode } from 'react'

type MerchantTabContextValue = {
  activeTabId: string
  setActiveTabId: (id: string) => void
}

const MerchantTabContext = createContext<MerchantTabContextValue | null>(null)

export function MerchantTabProvider({
  children,
  initialTabId = 'venue',
}: {
  children: ReactNode
  initialTabId?: string
}) {
  const [activeTabId, setActiveTabId] = useState(initialTabId)
  return (
    <MerchantTabContext.Provider value={{ activeTabId, setActiveTabId }}>
      {children}
    </MerchantTabContext.Provider>
  )
}

export function useMerchantTab() {
  const ctx = useContext(MerchantTabContext)
  if (ctx == null) {
    throw new Error('useMerchantTab must be used within MerchantScreenShell')
  }
  return ctx
}
