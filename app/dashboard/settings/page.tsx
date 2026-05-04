'use client'

import { useForm } from 'react-hook-form'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { mockUser } from '@/lib/mock-data'

type SettingsForm = { name: string; email: string }

export default function SettingsPage() {
  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: { name: mockUser.name, email: mockUser.email },
  })

  return (
    <>
      <DashboardTopbar title="Settings" />
      <div className="max-w-xl space-y-8 p-4 lg:p-8">
        <Card className="border-slate-200/80 dark:border-dark-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((data) => console.info('settings', data))}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <Button type="submit" className="rounded-xl">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
