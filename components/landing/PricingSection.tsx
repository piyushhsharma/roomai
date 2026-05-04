'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Check, Star } from 'lucide-react'
import { mockPricingPlans } from '@/lib/mock-data'

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="relative bg-roomai-light py-24 dark:bg-dark-bg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-accent-cyan/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Pricing</p>
          <h2 className="font-display mt-3 text-display font-bold text-slate-900 dark:text-white">
            Plans that scale with every render
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Switch monthly or annual anytime. Annual saves about 20% on Pro and Studio.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <Toggle checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly
            </span>
            {isAnnual && (
              <Badge className="border-accent-green/40 bg-accent-green/20 text-accent-green">Save ~20%</Badge>
            )}
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {mockPricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ scale: plan.popular ? 1.04 : 1.02, y: -4 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="border-primary-400/50 bg-primary-500 px-4 py-1 shadow-glow">
                    <Star className="mr-1 h-3 w-3" />
                    Recommended
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full overflow-hidden border-slate-200/90 bg-white/90 dark:bg-dark-card/95 ${
                  plan.popular ? 'glow-ring border-primary-500/50 shadow-glow-lg' : 'dark:border-dark-border'
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="font-display text-5xl font-bold text-slate-900 dark:text-white">
                        ${isAnnual ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-slate-500">/mo</span>
                    </div>
                    {plan.annualPrice > 0 && isAnnual && (
                      <p className="mt-2 text-xs text-slate-500">
                        Billed annually (${plan.price * 12}/yr before discount)
                      </p>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-green" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-violet-600 shadow-glow'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'secondary'}
                    size="lg"
                  >
                    <Link href={plan.id === 'studio' ? '/signup' : '/signup'}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
