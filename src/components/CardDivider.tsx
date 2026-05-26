import { design } from '../lib/figmaDesignAssets'

const d = design.cardDivider

export type CardDividerProps = {
  className?: string
}

/**
 * CardDivider — Figma 77857:92979.
 * Fixed 24px end caps; center bar stretches to fill remaining width.
 */
export function CardDivider({ className = '' }: CardDividerProps) {
  return (
    <div
      className={['card-divider', className].filter(Boolean).join(' ')}
      role="presentation"
      aria-hidden
      data-node-id="77857:92979"
    >
      <div className="card-divider__cap card-divider__cap--left" data-node-id="77857:92943">
        <img alt="" src={d.leftCap} className="card-divider__cap-art" />
      </div>
      <div className="card-divider__bar" data-node-id="77857:92980" />
      <div className="card-divider__cap card-divider__cap--right" data-node-id="77857:92951">
        <img alt="" src={d.rightCap} className="card-divider__cap-art" />
      </div>
    </div>
  )
}
