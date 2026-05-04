'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PenSquare,
  FolderKanban,
  Lightbulb,
  CreditCard,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/canvas', label: 'Create', icon: PenSquare },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/inspirations', label: 'Inspirations', icon: Lightbulb },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/95 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 border-b border-slate-200/80 px-6 py-5 dark:border-dark-border">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 text-sm font-bold text-white">
          R
        </span>
        <span className="font-display font-bold text-slate-900 dark:text-white">ROOMAI</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-200/80 p-4 dark:border-dark-border">
        <Link
          href="/"
          className="text-xs font-medium text-slate-500 hover:text-primary-500 dark:text-slate-400"
        >
          ← Back to marketing site
        </Link>
      </div>
    </aside>
  )
}
