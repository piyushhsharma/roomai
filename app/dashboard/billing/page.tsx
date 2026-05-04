'use client'

import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { mockPricingPlans, mockUser } from '@/lib/mock-data'

export default function BillingPage() {
  const plan = mockPricingPlans.find((p) => p.id === mockUser.plan) ?? mockPricingPlans[1]

  return (
    <>
      <DashboardTopbar title="Billing" />
      <div className="max-w-3xl space-y-8 p-4 lg:p-8">
        <Card className="border-slate-200/80 dark:border-dark-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Current plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{plan.name}</p>
                <p className="text-slate-500">${plan.price}/mo · {mockUser.credits} credits remaining</p>
              </div>
              <Button className="rounded-xl">Manage subscription</Button>
            </div>
            <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
