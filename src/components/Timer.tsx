import { Clock } from 'lucide-react'
import { formatDuration } from '../utils/formatters'

export default function Timer({
  remainingSeconds,
  urgency,
}: {
  remainingSeconds: number
  urgency: 'normal' | 'warning' | 'danger'
}) {
  const colorClasses =
    urgency === 'danger'
      ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
      : urgency === 'warning'
      ? 'bg-amber-50 text-amber-700 border-amber-300'
      : 'bg-white text-examblue-dark border-white/60'

  return (
    <div
      className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-sm font-semibold ${colorClasses}`}
      role="timer"
      aria-live="polite"
      aria-label={`Sisa waktu ${formatDuration(remainingSeconds)}`}
    >
      <Clock className="w-4 h-4" aria-hidden="true" />
      <span className="tabular-nums">{formatDuration(remainingSeconds)}</span>
    </div>
  )
}
