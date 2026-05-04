'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Toggle } from '@/components/ui/Toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  notifyEmail: z.boolean(),
  notifyProduct: z.boolean(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, { message: 'Must match', path: ['confirm'] })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const profile = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', notifyEmail: true, notifyProduct: false },
  })

  const password = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          profile.reset({
            name: d.user.name || '',
            notifyEmail: d.user.notifyEmail,
            notifyProduct: d.user.notifyProduct,
          })
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveProfile = profile.handleSubmit(async (data) => {
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      toast.error('Could not save profile')
      return
    }
    toast.success('Profile saved')
    await update({ name: data.name })
  })

  const savePassword = password.handleSubmit(async (data) => {
    const res = await fetch('/api/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast.error(j.error || 'Could not update password')
      return
    }
    toast.success('Password updated')
    password.reset()
  })

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file')
      return
    }
    if (file.size > 400_000) {
      toast.error('Image too large (max 400KB for avatar)')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      if (!res.ok) {
        toast.error('Could not update avatar')
        return
      }
      toast.success('Avatar updated')
      await update({ image: dataUrl })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const deleteAccount = async () => {
    if (!confirm('Delete your account and all data permanently?')) return
    const res = await fetch('/api/user', { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Could not delete account')
      return
    }
    toast.success('Account deleted')
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <DashboardTopbar title="Settings" />
      <div className="max-w-2xl space-y-8 p-4 lg:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-slate-200/80 dark:border-dark-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 text-lg font-bold text-white">
                      {(session?.user?.name || session?.user?.email || '?').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input id="avatar" type="file" accept="image/*" className="mt-1 cursor-pointer" onChange={onAvatar} />
                    <p className="mt-1 text-xs text-slate-500">PNG/JPG/WebP, max 400KB (stored on your DB row).</p>
                  </div>
                </div>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display name</Label>
                    <Input id="name" {...profile.register('name')} />
                    {profile.formState.errors.name && (
                      <p className="text-xs text-red-500">{profile.formState.errors.name.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="rounded-xl" disabled={profile.formState.isSubmitting}>
                    Save profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-slate-200/80 dark:border-dark-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={savePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cur">Current password</Label>
                    <Input id="cur" type="password" autoComplete="current-password" {...password.register('currentPassword')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="np">New password</Label>
                    <Input id="np" type="password" autoComplete="new-password" {...password.register('newPassword')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cf">Confirm new password</Label>
                    <Input id="cf" type="password" autoComplete="new-password" {...password.register('confirm')} />
                    {password.formState.errors.confirm && (
                      <p className="text-xs text-red-500">{password.formState.errors.confirm.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="rounded-xl" disabled={password.formState.isSubmitting}>
                    Update password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-red-200/50 dark:border-red-900/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-red-600 dark:text-red-400">Danger zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  Permanently delete your account, projects, designs, and uploads.
                </p>
                <Button type="button" variant="outline" className="rounded-xl border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30" onClick={deleteAccount}>
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-slate-200/80 dark:border-dark-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Theme follows your system or a saved choice.</p>
                {mounted && (
                  <div className="flex flex-wrap gap-2">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <Button
                        key={t}
                        type="button"
                        variant={theme === t ? 'default' : 'outline'}
                        className="rounded-xl capitalize"
                        onClick={() => setTheme(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 dark:border-dark-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Product updates</p>
                    <p className="text-xs text-slate-500">Tips and changelog summaries.</p>
                  </div>
                  <Toggle
                    checked={profile.watch('notifyProduct')}
                    onCheckedChange={(v) => profile.setValue('notifyProduct', v)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email notifications</p>
                    <p className="text-xs text-slate-500">Important alerts about your workspace.</p>
                  </div>
                  <Toggle
                    checked={profile.watch('notifyEmail')}
                    onCheckedChange={(v) => profile.setValue('notifyEmail', v)}
                  />
                </div>
                <Button type="button" className="rounded-xl" onClick={saveProfile}>
                  Save notification preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
