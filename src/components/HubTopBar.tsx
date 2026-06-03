import type { ReactNode } from 'react'
import { useHubScrollElevated } from '../context/HubScrollContext'

export type HubTopBarProps = {
  children: ReactNode
  className?: string
}

/**
 * Figma 79413:251103 — absolute top bar (gradient only).
 * Overlays hero at top; `fixed` when scrolled so it stays visible (no solid fill / border on the bar).
 */
export function HubTopBar({ children, className = '' }: HubTopBarProps) {
  const elevated = useHubScrollElevated()

  return (
    <div
      className={['hub-top-bar', elevated ? 'hub-top-bar--elevated' : '', className].filter(Boolean).join(' ')}
      data-name="Top bar"
      data-node-id="79413:251103"
    >
      {children}
    </div>
  )
}
