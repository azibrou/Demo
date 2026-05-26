import { useNavigate } from 'react-router-dom'
import { saveMe } from '../../lib/boltFoodTallinnHomeContent'
import { ThumbnailMRowBlock } from '../blocks/ThumbnailMRowBlock'

/** Home “Save me” restaurant row block. */
export function HomeSaveMeBlock() {
  const navigate = useNavigate()
  return (
    <ThumbnailMRowBlock
      title="Save me"
      ariaLabel="Save me"
      items={saveMe}
      onItemClick={() => navigate('/restaurant')}
    />
  )
}
