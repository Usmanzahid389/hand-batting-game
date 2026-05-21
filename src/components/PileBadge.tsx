import './PileBadge.css'

interface PileBadgeProps {
  label: string
  count: number
}

export function PileBadge({ label, count }: PileBadgeProps) {
  return (
    <div className="pile-badge">
      <span className="pile-badge__label">{label}</span>
      <span className="pile-badge__count">{count}</span>
    </div>
  )
}
