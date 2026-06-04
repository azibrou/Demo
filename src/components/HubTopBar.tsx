import type { ReactNode } from 'react'
import { useHubScrollElevated } from '../context/HubScrollContext'

export type HubTopBarProps = {
  children: ReactNode
  className?: string
}

/**
 * Figma 79413:251103 — direct child of `.home-page`; sticky for full hub scroll (gradient only).
 * Home hero overlap via `.home-page > .hub-top-bar + .home-hero-stack` negative margin in styles.css.
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
