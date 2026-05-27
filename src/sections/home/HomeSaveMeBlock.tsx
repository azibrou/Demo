import { saveMe } from '../../lib/boltFoodTallinnHomeContent'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import { ThumbnailMRowBlock } from '../blocks/ThumbnailMRowBlock'

/** Home “Save me” restaurant row block. */
export function HomeSaveMeBlock() {
  const navigate = useEaterNavigate()
  return (
    <ThumbnailMRowBlock
      title="Save me"
      ariaLabel="Save me"
      items={saveMe}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
