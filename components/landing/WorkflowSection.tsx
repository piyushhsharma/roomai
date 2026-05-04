'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Camera, Palette, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Camera,
    title: 'Upload your room',
    description: 'Drag in a photo or floor plate — ROOMAI reads geometry, light, and focal hierarchy.',
    color: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    preview: 'linear-gradient(135deg,#0f172a,#1e293b 40%,#334155)',
  },
  {
    icon: Palette,
    title: 'Choose your style',
    description: 'Dial in palettes, materials, and references. Blend presets or describe a custom mood in plain language.',
    color: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
    preview: 'linear-gradient(135deg,#312e81,#6366f1 45%,#a855f7)',
  },
  {
    icon: Sparkles,
    title: 'Generate the design',
    description: 'Receive layered renders, compare before/after, and ship exports your clients can sign off on.',
    color: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    preview: 'linear-gradient(135deg,#064e3b,#22c55e 40%,#6ee7b7)',
  },
]

export default function WorkflowSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 dark:bg-roomai-surface">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light opacity-50 dark:opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Workflow</p>
          <h2 className="font-display mt-3 text-display font-bold text-slate-900 dark:text-white">How it works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Three orchestrated beats — from raw capture to signed-off visual, without leaving the canvas.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[52%] hidden h-px lg:block">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-cyan-400"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.12 }}
                className="relative"
              >
                <div className="absolute -top-3 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-violet-600 text-sm font-bold text-white shadow-glow">
                  {index + 1}
                </div>

                <motion.div
                  className="absolute -top-6 right-4 z-30 hidden w-28 overflow-hidden rounded-2xl border border-white/20 shadow-float lg:block"
                  style={{ background: step.preview }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="aspect-[4/5] w-full bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-[10px] font-medium text-white/90">Live preview</p>
                </motion.div>

                <Card className="card-glass relative z-10 h-full pt-8">
                  <CardHeader className="text-center">
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${step.color}`}
                    >
                      <step.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-display text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
