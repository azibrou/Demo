import { useEffect, useState } from 'react'

/** Tallinn — Rotermanni / Veerenni (Figma DineOut map area). */
export const TALLINN_DEFAULT_CENTER = { lat: 59.4369, lng: 24.7536 } as const

export type LatLng = { lat: number; lng: number }

export type GeolocationState =
  | { status: 'pending'; center: LatLng }
  | { status: 'ready'; center: LatLng; fromDevice: boolean }
  | { status: 'error'; center: LatLng; message: string }

/**
 * Resolves map center from `navigator.geolocation`, falling back to {@link TALLINN_DEFAULT_CENTER}.
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    status: 'pending',
    center: TALLINN_DEFAULT_CENTER,
  })

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'ready', center: TALLINN_DEFAULT_CENTER, fromDevice: false })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: 'ready',
          center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          fromDevice: true,
        })
      },
      () => {
        setState({
          status: 'error',
          center: TALLINN_DEFAULT_CENTER,
          message: 'Location unavailable',
        })
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }, [])

  return state
}
