import { useNavigate } from 'react-router-dom'
import { allRestaurants } from '../../lib/boltFoodTallinnHomeContent'
import { ThumbnailLListBlock } from '../blocks/ThumbnailLListBlock'

/** Home “All restaurants” vertical list block. */
export function HomeAllRestaurantsBlock() {
  const navigate = useNavigate()
  return (
    <ThumbnailLListBlock
      title="All restaurants"
      items={allRestaurants}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
