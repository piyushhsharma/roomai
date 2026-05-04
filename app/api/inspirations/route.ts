export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const createSchema = z.object({
  title: z.string().max(200).optional(),
  imageUrl: z.string().min(1).max(500_000),
  designId: z.string().cuid().optional().nullable(),
  notes: z.string().max(2000).optional(),
})

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.inspiration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ inspirations: items })
  } catch (e) {
    console.error('inspirations list', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = createSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    if (parsed.data.designId) {
      const d = await prisma.design.findFirst({
        where: { id: parsed.data.designId, userId: user.id },
      })
      if (!d) {
        return NextResponse.json({ error: 'Design not found' }, { status: 404 })
      }
    }

    const row = await prisma.inspiration.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        imageUrl: parsed.data.imageUrl,
        designId: parsed.data.designId ?? undefined,
        notes: parsed.data.notes,
      },
    })

    await logActivity(user.id, 'inspiration.saved', 'Saved inspiration', { inspirationId: row.id })

    return NextResponse.json({ inspiration: row })
  } catch (e) {
    console.error('inspiration create', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
