'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Features', href: '/#features' },
  { name: 'How it works', href: '/#how-it-works' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Pricing', href: '/#pricing' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-4 sm:px-4 md:px-6">
        <nav
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between gap-4 transition-all duration-500',
            isScrolled
              ? 'rounded-full border border-slate-200/70 bg-white/75 py-2.5 pl-5 pr-3 shadow-float backdrop-blur-2xl dark:border-dark-border dark:bg-dark-card/75'
              : 'rounded-full border border-transparent bg-transparent py-2.5 pl-2 pr-2'
          )}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet text-sm font-bold text-white shadow-glow">
              R
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">ROOMAI</span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-1 dark:bg-white/5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" asChild className="rounded-xl">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-xl shadow-glow">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-dark-border dark:bg-dark-card"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-dark-border">
                <span className="font-display font-bold text-slate-900 dark:text-white">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-2 border-t border-slate-200 p-4 dark:border-dark-border">
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button className="w-full rounded-xl" asChild>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
