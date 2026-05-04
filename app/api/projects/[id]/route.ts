export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional().nullable(),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: { id: params.id, userId: user.id },
      include: { _count: { select: { designs: true } } },
    })
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      project: {
        ...project,
        designCount: project._count.designs,
      },
    })
  } catch (e) {
    console.error('project get', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const owned = await prisma.project.findFirst({
      where: { id: params.id, userId: user.id },
    })
    if (!owned) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const json = await req.json()
    const parsed = patchSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(parsed.data.name != null ? { name: parsed.data.name } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      },
    })

    await logActivity(user.id, 'project.updated', `Updated project “${project.name}”`, { projectId: project.id })

    return NextResponse.json({ project })
  } catch (e) {
    console.error('project patch', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const owned = await prisma.project.findFirst({
      where: { id: params.id, userId: user.id },
    })
    if (!owned) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.project.delete({ where: { id: params.id } })
    await logActivity(user.id, 'project.deleted', `Deleted project “${owned.name}”`, { projectId: params.id })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('project delete', e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
