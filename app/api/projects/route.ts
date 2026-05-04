export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
})

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { designs: true } },
        designs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { resultUrl: true, style: true, isMock: true },
        },
      },
    })

    return NextResponse.json({
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        designCount: p._count.designs,
        latestDesign: p.designs[0] ?? null,
      })),
    })
  } catch (e) {
    console.error('projects list', e)
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
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

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description,
      },
    })

    await logActivity(user.id, 'project.created', `Created project “${project.name}”`, { projectId: project.id })

    return NextResponse.json({ project })
  } catch (e) {
    console.error('project create', e)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
