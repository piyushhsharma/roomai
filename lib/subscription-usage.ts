import { prisma } from '@/lib/prisma'

function startOfUtcDay(d: Date) {
  const x = new Date(d)
  x.setUTCHours(0, 0, 0, 0)
  return x.getTime()
}

export async function ensureSubscription(userId: string) {
  return prisma.subscription.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

export async function resetDailyUsageIfNeeded(userId: string) {
  const sub = await ensureSubscription(userId)
  const today = startOfUtcDay(new Date())
  const last = startOfUtcDay(sub.lastUsageReset)
  if (today > last) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        dailyGenerationsUsed: 0,
        lastUsageReset: new Date(),
      },
    })
    return prisma.subscription.findUniqueOrThrow({ where: { userId } })
  }
  return sub
}

export async function canGenerate(userId: string): Promise<{ ok: boolean; used: number; cap: number }> {
  const sub = await resetDailyUsageIfNeeded(userId)
  return {
    ok: sub.dailyGenerationsUsed < sub.dailyCap,
    used: sub.dailyGenerationsUsed,
    cap: sub.dailyCap,
  }
}

export async function recordGeneration(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: { dailyGenerationsUsed: { increment: 1 } },
  })
}
