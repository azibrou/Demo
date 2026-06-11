import { useNavigate } from 'react-router-dom'
import {
  boltMarketToompuiesteeStoreNavState,
  isBoltMarketToompuiesteeTitle,
} from '../../lib/merchantNavigation'
import { ThumbnailMRowBlock, type ThumbnailMRowBlockItem } from '../blocks/ThumbnailMRowBlock'

export type StoresProviderSectionBlockProps = {
  title: string
  ariaLabel: string
  items: readonly ThumbnailMRowBlockItem[]
  nodeId?: string
}

/** Provider carousel section — Figma 77303:218319 / 218322 / 218325. */
export function StoresProviderSectionBlock({ title, ariaLabel, items, nodeId }: StoresProviderSectionBlockProps) {
  const navigate = useNavigate()

  return (
    <div data-node-id={nodeId}>
      <ThumbnailMRowBlock
        title={title}
        ariaLabel={ariaLabel}
        items={items}
        isItemClickable={(item) => isBoltMarketToompuiesteeTitle(item.title)}
        onItemClick={() =>
          navigate('/store-merchant', { state: boltMarketToompuiesteeStoreNavState() })
        }
      />
    </div>
  )
}
