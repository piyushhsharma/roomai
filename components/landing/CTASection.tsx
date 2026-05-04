'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-br from-primary-600 via-violet-600 to-cyan-500 bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4" />
          Start free — no credit card
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display mt-8 text-hero font-bold tracking-tight text-white text-balance"
        >
          Design the next room in your pipeline tonight
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/85"
        >
          Join teams using ROOMAI to ship cinematic interiors, aligned palettes, and client-ready boards without the
          bottleneck.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-14 rounded-2xl bg-white px-10 text-base font-semibold text-primary-600 shadow-lg hover:bg-slate-50"
          >
            <Link href="/signup">
              Create your workspace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 rounded-2xl border-white/40 bg-white/10 px-10 text-base text-white backdrop-blur-md hover:bg-white/20"
          >
            <Link href="/dashboard/canvas">Open design canvas</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
