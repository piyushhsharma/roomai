export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const patchSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  image: z.string().max(500_000).optional().nullable(),
  notifyEmail: z.boolean().optional(),
  notifyProduct: z.boolean().optional(),
})

export async function GET() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        credits: true,
        notifyEmail: true,
        notifyProduct: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (e) {
    console.error('user get', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = patchSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.image !== undefined ? { image: parsed.data.image } : {}),
        ...(parsed.data.notifyEmail !== undefined ? { notifyEmail: parsed.data.notifyEmail } : {}),
        ...(parsed.data.notifyProduct !== undefined ? { notifyProduct: parsed.data.notifyProduct } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        credits: true,
        notifyEmail: true,
        notifyProduct: true,
      },
    })

    await logActivity(sessionUser.id, 'profile.updated', 'Updated profile settings')

    return NextResponse.json({ user })
  } catch (e) {
    console.error('user patch', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.delete({ where: { id: sessionUser.id } })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('user delete', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
