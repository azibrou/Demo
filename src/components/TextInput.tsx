import { useCallback, useRef, useState, type InputHTMLAttributes, type RefObject } from 'react'

/** Figma 80618:194575–194596 — Input visual states. */
export type TextInputVisualState =
  | 'default'
  | 'default-focused'
  | 'filled'
  | 'filled-focused'
  | 'error-empty'
  | 'error-filled'

export type TextInputProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  autoFocus?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  className?: string
  'aria-label'?: string
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'inputMode' | 'type' | 'autoComplete' | 'name' | 'id'>

export function resolveTextInputVisualState(
  value: string,
  focused: boolean,
  error?: string,
): TextInputVisualState {
  const filled = value.length > 0
  if (error) return filled ? 'error-filled' : 'error-empty'
  if (!filled && !focused) return 'default'
  if (!filled && focused) return 'default-focused'
  if (filled && !focused) return 'filled'
  return 'filled-focused'
}

/**
 * Text field — Figma 80618:194575 (default) through 80618:194596 (error-filled).
 */
export function TextInput({
  value = '',
  onChange,
  placeholder = 'Placeholder',
  error,
  autoFocus = false,
  inputRef: inputRefProp,
  className = '',
  inputMode,
  type = 'text',
  autoComplete,
  name,
  id,
  'aria-label': ariaLabel,
}: TextInputProps) {
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = inputRefProp ?? internalRef
  const [focused, setFocused] = useState(autoFocus)

  const visualState = resolveTextInputVisualState(value, focused, error)

  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])

  return (
    <div
      className={['bolt-text-input-field flex w-full min-w-0 flex-col gap-1', className].filter(Boolean).join(' ')}
      data-name="Input"
    >
      <div
        className={['bolt-text-input relative h-14 w-full min-w-0', `bolt-text-input--${visualState}`].join(' ')}
        data-state={visualState}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-label={ariaLabel ?? placeholder}
          aria-invalid={error ? true : undefined}
          className="bolt-text-input__control bolt-font-body-m-regular absolute inset-0 w-full bg-transparent px-4 text-[var(--color-content-primary)] outline-none placeholder:text-[var(--color-content-secondary)]"
        />
      </div>
      {error ? (
        <p className="bolt-font-body-s-regular text-[var(--color-content-danger-primary)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
