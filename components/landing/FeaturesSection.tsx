'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Home, Sofa, Palette, Monitor, LayoutGrid, Pencil } from 'lucide-react'

const features = [
  {
    icon: Home,
    title: 'AI room redesign',
    description: 'Recompose walls, lighting, and focal points from a single photo with layout-aware prompts.',
    color: 'border-primary-500/30 bg-primary-500/15 text-primary-300',
  },
  {
    icon: Sofa,
    title: 'AI furnishing',
    description: 'Populate empty floor plans with cohesive furniture sets that respect scale and circulation.',
    color: 'border-accent-green/30 bg-accent-green/10 text-accent-green',
  },
  {
    icon: Palette,
    title: 'Style transfer',
    description: 'Jump between modern, coastal, Japandi, and bespoke blends without restarting the project.',
    color: 'border-accent-violet/30 bg-accent-violet/15 text-violet-200',
  },
  {
    icon: Monitor,
    title: 'HD rendering',
    description: 'Export campaign-ready stills with crisp materials, soft shadows, and calibrated color.',
    color: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  },
  {
    icon: LayoutGrid,
    title: 'Smart layouts',
    description: 'Let ROOMAI propose traffic flow, focal walls, and negative space tuned to each room archetype.',
    color: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  },
  {
    icon: Pencil,
    title: 'Real-time editing',
    description: 'Iterate live with sliders, masks, and prompt refinements synced to every regeneration.',
    color: 'border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-200',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-roomai-light py-24 dark:bg-dark-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08),_transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Product depth</p>
          <h2 className="font-display mt-3 text-display font-bold text-slate-900 dark:text-white">
            Everything your studio expects from an AI interior OS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Precision tools, velvet-smooth interactions, and glass-depth cards that keep complex workflows legible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <Card className="group relative h-full overflow-hidden border-slate-200/80 bg-white/80 dark:border-dark-border dark:bg-dark-card/90">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-cyan-400/10" />
                </div>
                <CardHeader className="relative">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
