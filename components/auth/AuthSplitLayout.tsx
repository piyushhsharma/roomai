'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function AuthSplitLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-roomai-light dark:bg-dark-bg">
      <div className="grid min-h-screen lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden overflow-hidden lg:flex"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-violet-700 to-cyan-600 bg-[length:200%_200%] animate-gradient-shift" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.2),transparent_55%)]" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-bold backdrop-blur">
                R
              </span>
              <span className="font-display text-lg font-bold">ROOMAI</span>
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                AI interior OS
              </div>
              <h2 className="font-display mt-6 max-w-md text-4xl font-bold leading-tight">{title}</h2>
              <p className="mt-4 max-w-sm text-white/80">{subtitle}</p>
            </div>
            <p className="text-sm text-white/50">Original visuals &amp; branding. Inspired by modern AI productivity tools.</p>
          </div>

          {/* Floating mock cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="pointer-events-none absolute bottom-16 right-12 z-20 w-64 rounded-2xl border border-white/20 bg-black/25 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div
              className="mb-3 aspect-video w-full rounded-xl"
              style={{
                background: 'linear-gradient(135deg,#1e1b4b,#6366f1 50%,#22d3ee)',
              }}
            />
            <div className="flex gap-2">
              <span className="rounded-lg bg-white/20 px-2 py-1 text-[10px]">Living</span>
              <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px]">Neo-minimal</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col justify-center px-4 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
