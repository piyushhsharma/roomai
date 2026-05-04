'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Layers, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import BeforeAfterSlider from './BeforeAfterSlider'

const floatCards = [
  { title: 'Layout graph', subtitle: 'Auto-detected planes', icon: Layers, delay: 0 },
  { title: 'Style DNA', subtitle: '48 presets + custom', icon: Wand2, delay: 0.2 },
  { title: 'Neural render', subtitle: 'Path-traced polish', icon: Cpu, delay: 0.4 },
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-24 pt-28 mesh-bg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/20 to-dark-bg" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary-500/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-accent-violet/30 blur-[90px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 border-primary-500/30 bg-primary-500/15 px-4 py-1.5 text-primary-200">
                Generative interior intelligence
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="font-display text-hero font-bold tracking-tight text-balance text-white"
            >
              Furnish reality.
              <span className="block gradient-text">Before the paint dries.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl"
            >
              ROOMAI transforms photos into editorial-grade interiors — style transfer, smart layouts, and HD renders in
              one cinematic workflow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-violet-600 px-8 text-base shadow-glow-lg"
              >
                <Link href="/signup">
                  Start free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-md hover:bg-white/10"
              >
                <Link href="/dashboard/canvas">Open canvas</Link>
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-slate-500"
            >
              No credit card · SOC2-ready infrastructure · Exports you can share today
            </motion.p>
          </div>

          <div className="relative">
            {floatCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35 + card.delay, duration: 0.55 }}
                className={[
                  'glass-panel absolute z-20 hidden rounded-2xl p-4 shadow-float lg:block lg:w-56',
                  i === 0 ? '-left-4 top-8' : '',
                  i === 1 ? '-right-2 top-1/3' : '',
                  i === 2 ? 'bottom-12 left-4' : '',
                ].join(' ')}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <card.icon className="mb-3 h-6 w-6 text-cyan-300" />
                  <p className="font-display text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-xs text-slate-400">{card.subtitle}</p>
                </motion.div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative z-10"
            >
              <BeforeAfterSlider />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-24 left-[8%] h-24 w-24 rounded-full bg-primary-500/20 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="pointer-events-none absolute bottom-32 right-[12%] h-32 w-32 rounded-full bg-cyan-400/15 blur-2xl"
      />
    </section>
  )
}
