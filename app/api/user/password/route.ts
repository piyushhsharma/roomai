export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { compare, hash } from 'bcryptjs'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
})

export async function PATCH(req: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } })
    if (!user?.password) {
      return NextResponse.json(
        { error: 'Password login is not enabled for this account (e.g. Google-only).' },
        { status: 400 }
      )
    }

    const ok = await compare(parsed.data.currentPassword, user.password)
    if (!ok) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const hashed = await hash(parsed.data.newPassword, 12)
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { password: hashed },
    })

    await logActivity(sessionUser.id, 'security.password', 'Changed password')

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('password patch', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
