import { design } from '../lib/figmaDesignAssets'
import { HomeCarouselRow } from './HomeCarouselRow'
import { ShortcutItem } from './ShortcutItem'

const art = design.shortcutsCarousel

const ITEMS: { iconSrc: string; label: string; to?: string }[] = [
  { iconSrc: art[0]!, label: 'All stores', to: '/stores' },
  { iconSrc: art[1]!, label: 'Groceries' },
  { iconSrc: art[2]!, label: 'Alcoholic beverages' },
  { iconSrc: art[3]!, label: 'Ice cream' },
  { iconSrc: art[4]!, label: 'Flowers' },
]

/**
 * Figma 74916:234866 — horizontal shortcuts row, reusing {@link ShortcutItem} (`scaled`).
 * Layout: {@link HomeCarouselRow}; scaling in `src/css/styles.css` (`--shortcut-scale`).
 */
export function ShortcutsCarousel() {
  return (
    <HomeCarouselRow>
      {ITEMS.map((item) => (
        <ShortcutItem
          key={item.label}
          variant="scaled"
          iconSrc={item.iconSrc}
          label={item.label}
          to={item.to}
        />
      ))}
    </HomeCarouselRow>
  )
}
