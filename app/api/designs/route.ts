export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const take = Math.min(Number(searchParams.get('take') ?? '24') || 24, 60)

    const designs = await prisma.design.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        resultUrl: true,
        style: true,
        roomType: true,
        prompt: true,
        isMock: true,
        durationMs: true,
        createdAt: true,
        projectId: true,
      },
    })

    return NextResponse.json({ designs })
  } catch (e) {
    console.error('designs list', e)
    return NextResponse.json({ error: 'Failed to load designs' }, { status: 500 })
  }
}
