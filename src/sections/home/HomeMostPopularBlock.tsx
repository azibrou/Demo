import { useNavigate } from 'react-router-dom'
import { mostPopular } from '../../lib/boltFoodTallinnHomeContent'
import { ThumbnailMRowBlock } from '../blocks/ThumbnailMRowBlock'

/** Home “Most popular” restaurant row block. */
export function HomeMostPopularBlock() {
  const navigate = useNavigate()
  return (
    <ThumbnailMRowBlock
      title="Most popular"
      ariaLabel="Most popular"
      items={mostPopular}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
