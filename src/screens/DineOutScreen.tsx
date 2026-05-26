import { GoogleMapBackground } from '../components/GoogleMapBackground'
import { useGeolocation } from '../hooks/useGeolocation'
import { DineOutTopNavBlock } from '../sections/dineout/DineOutTopNavBlock'

/**
 * DineOut map hub — Figma [77303:219498](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77303-219498).
 */
export function DineOutScreen() {
  const geo = useGeolocation()

  return (
    <div
      className="dine-out-screen relative min-h-svh w-full overflow-hidden bg-[var(--color-layer-floor-0)]"
      data-node-id="77303:219498"
    >
      <div className="absolute inset-0 z-0">
        <GoogleMapBackground center={geo.center} />
      </div>

      <div className="relative z-10 flex min-h-svh w-full flex-col overflow-visible pointer-events-none">
        <DineOutTopNavBlock />
      </div>
    </div>
  )
}
