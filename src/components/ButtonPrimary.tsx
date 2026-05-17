import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonPrimaryProps = {
  children: ReactNode
  className?: string
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'onClick'>

/** Primary CTA — Figma node 70443:1500202 */
export function ButtonPrimary({ children, className = '', type = 'button', disabled, onClick }: ButtonPrimaryProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'relative h-14 w-full shrink-0 rounded-full bg-[#2b8659] px-6 text-center text-lg font-semibold leading-[22px] tracking-[-0.252px] text-white',
        'disabled:opacity-50',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
