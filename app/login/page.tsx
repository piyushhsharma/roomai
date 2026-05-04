'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    console.info('login', data)
  }

  return (
    <AuthSplitLayout
      title="Welcome back to your studio"
      subtitle="Pick up where you left off — projects, palettes, and renders stay synced across devices."
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:hidden">
        <Link href="/" className="font-display text-xl font-bold text-slate-900 dark:text-white">
          ROOMAI
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-float backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/80"
      >
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Log in</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          New here?{' '}
          <Link href="/signup" className="font-medium text-primary-500 hover:underline">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@studio.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full rounded-xl shadow-glow" size="lg">
            Continue
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-dark-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-2 text-slate-500 dark:bg-dark-card">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="rounded-xl dark:border-dark-border">
            Google
          </Button>
          <Button type="button" variant="outline" className="rounded-xl dark:border-dark-border">
            Apple
          </Button>
        </div>
      </motion.div>
    </AuthSplitLayout>
  )
}
