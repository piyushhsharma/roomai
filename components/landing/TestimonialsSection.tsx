'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { mockTestimonials } from '@/lib/mock-data'

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % mockTestimonials.length), 6000)
    return () => clearInterval(t)
  }, [])

  const t = mockTestimonials[index]

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-dark-bg">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-display font-bold text-slate-900 dark:text-white">
            Loved by creators shipping real spaces
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            From independent designers to distributed property teams, ROOMAI keeps visuals on-brand and on-deadline.
          </p>
        </motion.div>

        <div className="relative rounded-4xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-8 shadow-float dark:border-dark-border dark:from-dark-card dark:to-roomai-surface md:p-12">
          <Quote className="absolute right-8 top-8 h-10 w-10 text-primary-500/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="relative"
            >
              <div className="mb-6 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-display text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100 md:text-2xl">
                “{t.content}”
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ background: t.gradient }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {mockTestimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-8 bg-primary-500' : 'w-2 bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl dark:border-dark-border"
                onClick={() => setIndex((i) => (i - 1 + mockTestimonials.length) % mockTestimonials.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl dark:border-dark-border"
                onClick={() => setIndex((i) => (i + 1) % mockTestimonials.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
