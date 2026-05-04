'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!startOnView) {
      started.current = true
    }
    const el = ref.current
    if (!el) return

    const run = () => {
      if (started.current) return
      started.current = true
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.floor(eased * end))
        if (t < 1) requestAnimationFrame(step)
        else setValue(end)
      }
      requestAnimationFrame(step)
    }

    if (!startOnView) {
      run()
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) run()
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, duration, startOnView])

  return { ref, value }
}
