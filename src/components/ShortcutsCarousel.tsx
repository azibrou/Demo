import { homeShortcuts } from '../lib/boltFoodTallinnHomeContent'
import { HomeScaledRow } from './HomeScaledRow'
import { ShortcutItem } from './ShortcutItem'

/**
 * Figma [76281:68503](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76281-68503)
 */
export function ShortcutsCarousel() {
  return (
    <HomeScaledRow
      className="py-3"
      ariaLabel="Shortcuts"
      data-name="Shortcuts"
      data-node-id="76281:68503"
    >
      {homeShortcuts.map((item) => (
        <ShortcutItem
          key={item.id}
          variant="scaled"
          iconSrc={item.iconSrc}
          iconVariant={item.iconVariant}
          label={item.label}
          labelSingleLine={item.labelSingleLine}
          to={item.to}
        />
      ))}
    </HomeScaledRow>
  )
}
