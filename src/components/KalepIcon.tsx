import type { KalepIconStem } from '../lib/kalepIcons'
import { kalepIconUrl } from '../lib/kalepIcons'

export type KalepIconSize = 16 | 20 | 24

const SIZE_CLASS: Record<KalepIconSize, string> = {
  16: 'size-4',
  20: 'size-5',
  24: 'size-6',
}

export type KalepIconProps = {
  /** File stem in `@bolteu/kalep-icons-svg` (e.g. `search`, `chevron-down`). */
  name: KalepIconStem
  size?: KalepIconSize
  className?: string
  'aria-hidden'?: boolean
}

/**
 * Renders a Kalep SVG glyph from `@bolteu/kalep-icons-svg` at 16 / 20 / 24px.
 */
export function KalepIcon({ name, size = 24, className = '', 'aria-hidden': ariaHidden = true }: KalepIconProps) {
  return (
    <span
      className={['relative shrink-0', SIZE_CLASS[size], className].filter(Boolean).join(' ')}
      aria-hidden={ariaHidden}
    >
      <img
        alt=""
        src={kalepIconUrl(name)}
        className="pointer-events-none absolute inset-0 block size-full max-w-none"
      />
    </span>
  )
}
