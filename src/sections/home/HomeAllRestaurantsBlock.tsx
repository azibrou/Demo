import { allRestaurants } from '../../lib/boltFoodTallinnHomeContent'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import { ThumbnailLListBlock } from '../blocks/ThumbnailLListBlock'

/** Home “All restaurants” vertical list block. */
export function HomeAllRestaurantsBlock() {
  const navigate = useEaterNavigate()
  return (
    <ThumbnailLListBlock
      title="All restaurants"
      items={allRestaurants}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
