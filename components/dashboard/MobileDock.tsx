'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PenSquare, FolderKanban, Lightbulb, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/canvas', icon: PenSquare, label: 'Create' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/inspirations', icon: Lightbulb, label: 'Ideas' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-200/80 bg-white/95 px-1 py-2 backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/95 lg:hidden">
      <div className="flex w-full justify-around overflow-x-auto">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-medium',
                active ? 'text-primary-600 dark:text-primary-300' : 'text-slate-500'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
