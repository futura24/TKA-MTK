import { useEffect, useRef, useState } from 'react'
import type { ExamTiming } from '../types'

/**
 * Timer ujian berbasis timestamp absolut (startTime/endTime), bukan counter
 * yang di-decrement setiap detik. Ini memastikan sisa waktu tetap benar
 * walau halaman di-refresh, karena remainingTime = endTime - Date.now().
 */
export function useTimer(timing: ExamTiming | null, onExpire: () => void) {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    timing ? Math.max(0, timing.endTime - Date.now()) : 0
  )
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!timing) return
    expiredRef.current = false

    const tick = () => {
      const remaining = Math.max(0, timing.endTime - Date.now())
      setRemainingMs(remaining)
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpireRef.current()
      }
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [timing])

  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const totalDuration = timing ? Math.max(1, (timing.endTime - timing.startTime) / 1000) : 1
  const elapsedRatio = timing ? 1 - remainingMs / 1000 / totalDuration : 0

  let urgency: 'normal' | 'warning' | 'danger' = 'normal'
  if (remainingSeconds <= 10 * 60) urgency = 'danger'
  else if (remainingSeconds <= 30 * 60) urgency = 'warning'

  return { remainingSeconds, urgency, elapsedRatio }
}
