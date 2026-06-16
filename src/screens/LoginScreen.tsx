import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonPrimary } from '../components/ButtonPrimary'
import { TextInput } from '../components/TextInput'
import { clearSavedPassword, getSavedPassword, hasSavedPassword, savePassword } from '../lib/passwordStore'

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 3l14 14M8.4 8.5A2.5 2.5 0 0 0 12.5 12M5.5 5.6C3.8 6.9 2.3 9 2 10c1 3 4.5 6 8 6 1.6 0 3.1-.5 4.4-1.4M9 4.1C9.3 4 9.7 4 10 4c3.5 0 7 3 8 6-.3.9-.8 1.8-1.5 2.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Simple lock icon used in the page hero. */
function LockIllustration() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect width="56" height="56" rx="16" fill="var(--color-bg-neutral-secondary, #f4f4f4)" />
      <path
        d="M20 26v-5a8 8 0 0 1 16 0v5"
        stroke="var(--color-special-brand-primary, #2b8659)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="15"
        y="26"
        width="26"
        height="18"
        rx="4"
        fill="var(--color-special-brand-primary, #2b8659)"
      />
      <circle cx="28" cy="35" r="2.5" fill="white" />
      <rect x="27" y="35" width="2" height="4" rx="1" fill="white" />
    </svg>
  )
}

export function LoginScreen() {
  const navigate = useNavigate()
  const passwordRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(() => getSavedPassword())
  const [remember, setRemember] = useState(() => hasSavedPassword())
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const validate = useCallback(() => {
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email'
    if (!password) next.password = 'Password is required'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters'
    return next
  }, [email, password])

  const handleSubmit = useCallback(() => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setSubmitted(true)
      return
    }

    if (remember) {
      savePassword(password)
    } else {
      clearSavedPassword()
    }

    navigate('/')
  }, [validate, remember, password, navigate])

  const handleEmailChange = useCallback(
    (v: string) => {
      setEmail(v)
      if (submitted) setErrors((e) => ({ ...e, email: undefined }))
    },
    [submitted],
  )

  const handlePasswordChange = useCallback(
    (v: string) => {
      setPassword(v)
      if (submitted) setErrors((e) => ({ ...e, password: undefined }))
    },
    [submitted],
  )

  const handleRememberToggle = useCallback(() => {
    setRemember((prev) => {
      if (prev) clearSavedPassword()
      return !prev
    })
  }, [])

  return (
    <div className="bolt-font-base flex min-h-svh w-full flex-col bg-[var(--color-layer-floor-1,#fff)] text-[var(--color-content-primary)]">
      {/* Header */}
      <div className="flex items-center px-6 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="relative grid size-6 shrink-0 place-items-center outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          aria-label="Back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-8">
        <div className="mb-8 flex flex-col items-start gap-4">
          <LockIllustration />
          <div>
            <h1 className="bolt-font-heading-m-accent text-[var(--color-content-primary)]">Sign in</h1>
            <p className="bolt-font-body-s-regular mt-1 text-[var(--color-content-secondary)]">
              Welcome back! Enter your details to continue.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          noValidate
        >
          {/* Email */}
          <TextInput
            id="login-email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            type="email"
            autoComplete="email"
            aria-label="Email address"
            error={errors.email}
          />

          {/* Password with show/hide toggle */}
          <div className="relative">
            <TextInput
              inputRef={passwordRef}
              id="login-password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              aria-label="Password"
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-4 text-[var(--color-content-secondary)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>

          {/* Remember password */}
          <label className="flex cursor-pointer items-center gap-3 py-1 select-none">
            <span
              role="checkbox"
              aria-checked={remember}
              tabIndex={0}
              onClick={handleRememberToggle}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  handleRememberToggle()
                }
              }}
              className={[
                'relative flex size-5 shrink-0 items-center justify-center rounded border-2 outline-none ring-[var(--color-special-brand-alt)]/20 transition-colors focus-visible:ring-2',
                remember
                  ? 'border-[var(--color-special-brand-primary,#2b8659)] bg-[var(--color-special-brand-primary,#2b8659)]'
                  : 'border-[var(--color-border-separator,#d8d8d8)] bg-transparent',
              ].join(' ')}
            >
              {remember && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                  <path
                    d="M1 5l3.5 3.5L11 1"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className="bolt-font-body-s-regular text-[var(--color-content-primary)]"
              onClick={handleRememberToggle}
            >
              Remember password for this session
            </span>
          </label>

          <div className="mt-2">
            <ButtonPrimary type="submit">Sign in</ButtonPrimary>
          </div>
        </form>

        <p className="bolt-font-body-s-regular mt-6 text-center text-[var(--color-content-secondary)]">
          Forgot your password?{' '}
          <button
            type="button"
            className="bolt-font-body-s-accent text-[var(--color-special-brand-primary,#2b8659)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          >
            Reset it
          </button>
        </p>
      </div>
    </div>
  )
}
