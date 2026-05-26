import { useNavigate } from 'react-router-dom'
import { storesAllStoresList } from '../../lib/boltFoodTallinnStoresContent'
import { ThumbnailLListBlock } from '../blocks/ThumbnailLListBlock'

/** All Stores vertical list — Figma 77303:218328. */
export function StoresAllStoresBlock() {
  const navigate = useNavigate()
  return (
    <div data-node-id="77303:218328">
      <ThumbnailLListBlock
        title="All stores"
        items={storesAllStoresList}
        onItemClick={() => navigate('/store-merchant')}
      />
    </div>
  )
}
