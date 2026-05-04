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
    const take = Math.min(Number(searchParams.get('take') ?? '30') || 30, 100)

    const logs = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take,
    })

    return NextResponse.json({
      activity: logs.map((l) => ({
        id: l.id,
        type: l.type,
        message: l.message,
        createdAt: l.createdAt,
      })),
    })
  } catch (e) {
    console.error('activity', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
