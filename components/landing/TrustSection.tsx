'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/use-count-up'
import { mockTrustLogos } from '@/lib/mock-data'

function Metric({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(end, 2200)
  return (
    <div className="text-center">
      <div
        ref={ref}
        className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl"
      >
        {value.toLocaleString()}
        {suffix ?? ''}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  )
}

function MetricStatic({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </motion.div>
  )
}

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="relative overflow-hidden border-y border-slate-200/80 bg-roomai-light/90 py-20 dark:border-dark-border dark:bg-roomai-surface/50"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-accent-cyan/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary-500"
        >
          Trusted by design-led teams
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.05 }}
          className="mb-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80"
        >
          {mockTrustLogos.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="font-display text-lg font-semibold text-slate-400 dark:text-slate-500"
            >
              {name}
            </motion.span>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <Metric end={48000} suffix="+" label="Studio-grade renders shipped" />
          <Metric end={12000} suffix="+" label="Active design workspaces" />
          <Metric end={72} suffix=" NPS" label="Creator satisfaction score" />
          <MetricStatic value="4.2s" label="Typical hero-quality generation" />
        </div>
      </div>
    </section>
  )
}
