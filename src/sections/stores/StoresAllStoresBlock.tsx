import { useNavigate } from 'react-router-dom'
import { storesAllStoresList } from '../../lib/boltFoodTallinnStoresContent'
import {
  boltMarketToompuiesteeStoreNavState,
  isBoltMarketToompuiesteeTitle,
} from '../../lib/merchantNavigation'
import { ThumbnailLListBlock } from '../blocks/ThumbnailLListBlock'

/** All Stores vertical list — Figma 77303:218328. */
export function StoresAllStoresBlock() {
  const navigate = useNavigate()
  return (
    <div data-node-id="77303:218328">
      <ThumbnailLListBlock
        title="All stores"
        items={storesAllStoresList}
        isItemClickable={isBoltMarketToompuiesteeTitle}
        onItemClick={() =>
          navigate('/store-merchant', { state: boltMarketToompuiesteeStoreNavState() })
        }
      />
    </div>
  )
}
