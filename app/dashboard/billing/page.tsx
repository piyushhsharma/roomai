'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/Modal'

type Summary = {
  plan: string
  credits: number
  usage: { dailyUsed: number; dailyCap: number }
}

export default function BillingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return
        setSummary({
          plan: d.plan,
          credits: d.credits,
          usage: d.usage,
        })
      })
      .catch(() => toast.error('Could not load usage'))
  }, [])

  return (
    <>
      <DashboardTopbar title="Billing" />
      <div className="max-w-3xl space-y-8 p-4 lg:p-8">
        <Card className="border-slate-200/80 dark:border-dark-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Free plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              ROOMAI runs on generous free tiers for demos and portfolios. You are on the{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{summary?.plan ?? 'free'}</span> plan with
              daily AI generations capped for fair use.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-white/5">
              <p className="text-sm text-slate-500">Today&apos;s generations</p>
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                {summary ? `${summary.usage.dailyUsed} / ${summary.usage.dailyCap}` : '—'}
              </p>
              <p className="mt-2 text-sm text-slate-500">Workspace credits (legacy field): {summary?.credits ?? '—'}</p>
            </div>
            <Button type="button" variant="outline" className="rounded-xl dark:border-dark-border" onClick={() => setUpgradeOpen(true)}>
              View upgrade options (UI only)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Paid plans coming soon</ModalTitle>
            <ModalDescription>
              This build focuses on free-tier infrastructure. Stripe billing can be added later without changing your
              design workflow.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button className="rounded-xl" onClick={() => setUpgradeOpen(false)}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
