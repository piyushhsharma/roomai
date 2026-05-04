export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { resetDailyUsageIfNeeded } from '@/lib/subscription-usage'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [designCount, projectCount, dbUser, sub] = await Promise.all([
      prisma.design.count({ where: { userId: user.id } }),
      prisma.project.count({ where: { userId: user.id } }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { credits: true, plan: true, name: true, image: true, email: true },
      }),
      resetDailyUsageIfNeeded(user.id),
    ])

    return NextResponse.json({
      designCount,
      projectCount,
      credits: dbUser?.credits ?? 0,
      plan: dbUser?.plan ?? 'free',
      name: dbUser?.name,
      email: dbUser?.email,
      image: dbUser?.image,
      usage: {
        dailyUsed: sub.dailyGenerationsUsed,
        dailyCap: sub.dailyCap,
      },
    })
  } catch (e) {
    console.error('dashboard summary', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
