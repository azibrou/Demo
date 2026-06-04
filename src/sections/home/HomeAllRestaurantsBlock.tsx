import { allRestaurants } from '../../lib/boltFoodTallinnHomeContent'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import { thumbnailLToRestaurantNavState } from '../../lib/merchantNavigation'
import { ThumbnailLListBlock } from '../blocks/ThumbnailLListBlock'

/** Home “All restaurants” vertical list block. */
export function HomeAllRestaurantsBlock() {
  const navigate = useEaterNavigate()
  return (
    <ThumbnailLListBlock
      title="All restaurants"
      items={allRestaurants}
      onItemClick={(item) =>
        navigate('/restaurant', { state: thumbnailLToRestaurantNavState(item) })
      }
    />
  )
}
