import { useMemo } from 'react'
import type { LatLng } from '../hooks/useGeolocation'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function buildEmbedSrc(center: LatLng, zoom: number): string {
  const { lat, lng } = center
  if (API_KEY) {
    const params = new URLSearchParams({
      key: API_KEY,
      center: `${lat},${lng}`,
      zoom: String(zoom),
    })
    return `https://www.google.com/maps/embed/v1/view?${params}`
  }
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: String(zoom),
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params}`
}

export type GoogleMapBackgroundProps = {
  center: LatLng
  zoom?: number
  className?: string
}

/**
 * Full-bleed generic Google Maps embed — Figma DineOut 77303:219501.
 * Uses Maps Embed API when `VITE_GOOGLE_MAPS_API_KEY` is set; otherwise a standard embed URL (demo).
 */
export function GoogleMapBackground({ center, zoom = 16, className = '' }: GoogleMapBackgroundProps) {
  const src = useMemo(() => buildEmbedSrc(center, zoom), [center.lat, center.lng, zoom])

  return (
    <iframe
      title="Map"
      src={src}
      className={['google-map-background size-full border-0', className].join(' ')}
      data-node-id="77303:219501"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
