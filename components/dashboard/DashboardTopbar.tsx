'use client'

import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { mockUser } from '@/lib/mock-data'

export function DashboardTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-dark-border dark:bg-dark-bg/80 lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-primary-500">Workspace</p>
        <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>
      <div className="hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search projects, renders, palettes…" className="h-10 rounded-xl pl-10" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-2 py-1.5 dark:border-dark-border dark:bg-white/5"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: mockUser.avatarGradient }}
          >
            {mockUser.initials}
          </span>
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
            {mockUser.name}
          </span>
        </Link>
      </div>
    </header>
  )
}
