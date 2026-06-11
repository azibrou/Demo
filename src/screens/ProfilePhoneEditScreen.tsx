import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ButtonPrimary } from '../components/ButtonPrimary'
import { KalepIcon } from '../components/KalepIcon'
import { NavBar } from '../components/NavBar'
import { TextInput } from '../components/TextInput'
import { useProfileEditPhoneBack } from '../hooks/useProfileEditPhoneBack'
import { DEFAULT_PROFILE_PHONE, type ProfilePhone } from '../lib/profilePhone'
import { setProfilePhone } from '../lib/profilePhoneStore'

type EditPhoneLocationState = {
  phone?: ProfilePhone
}

/**
 * Update phone number — Figma 80618:193993.
 */
export function ProfilePhoneEditScreen() {
  const location = useLocation()
  const goBackToProfile = useProfileEditPhoneBack()
  const inputRef = useRef<HTMLInputElement>(null)

  const initialPhone = useMemo(
    () => (location.state as EditPhoneLocationState | null)?.phone ?? DEFAULT_PROFILE_PHONE,
    [location.state],
  )
  const [digits, setDigits] = useState(initialPhone.digits)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])

  const handleBack = useCallback(() => {
    goBackToProfile()
  }, [goBackToProfile])

  const handleSave = useCallback(() => {
    setProfilePhone({
      countryCode: initialPhone.countryCode,
      digits: digits.replace(/\D/g, ''),
    })
    goBackToProfile()
  }, [goBackToProfile, initialPhone.countryCode, digits])

  return (
    <div
      className="bolt-font-base relative flex min-h-svh w-full flex-col bg-[var(--color-layer-floor-1,#fff)] text-[var(--color-content-primary)]"
      data-node-id="80618:193993"
    >
      <NavBar title="Update phone number" onBack={handleBack} collapseMode="onScroll" />

      <div className="flex flex-1 flex-col px-6 pb-6 pt-10">
        <div className="flex w-full gap-2">
          <button
            type="button"
            className="bolt-text-input bolt-text-input--filled relative flex h-14 w-24 shrink-0 items-center gap-1 rounded-lg px-4"
            aria-label="Country code"
          >
            <span className="bolt-font-body-m-regular text-[var(--color-content-primary)]">
              {initialPhone.countryCode}
            </span>
            <KalepIcon name="chevron-down" size={20} className="ml-auto" />
          </button>

          <TextInput
            inputRef={inputRef}
            autoFocus
            value={digits}
            onChange={(v) => setDigits(v.replace(/\D/g, ''))}
            placeholder="Phone number"
            inputMode="numeric"
            autoComplete="tel-national"
            aria-label="Phone number"
            className="min-w-0 flex-1"
          />
        </div>
      </div>

      <div className="px-6 py-3">
        <ButtonPrimary onClick={handleSave}>Save</ButtonPrimary>
      </div>
    </div>
  )
}
