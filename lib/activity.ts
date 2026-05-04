import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function logActivity(
  userId: string,
  type: string,
  message: string,
  meta?: Record<string, unknown>
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        type,
        message,
        meta: meta === undefined ? undefined : (meta as Prisma.InputJsonValue),
      },
    })
  } catch {
    // non-fatal
  }
}
