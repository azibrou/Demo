import { mostPopular } from '../../lib/boltFoodTallinnHomeContent'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import { ThumbnailMRowBlock } from '../blocks/ThumbnailMRowBlock'

/** Home “Most popular” restaurant row block. */
export function HomeMostPopularBlock() {
  const navigate = useEaterNavigate()
  return (
    <ThumbnailMRowBlock
      title="Most popular"
      ariaLabel="Most popular"
      items={mostPopular}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
