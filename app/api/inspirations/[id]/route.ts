export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const row = await prisma.inspiration.findFirst({
      where: { id: params.id, userId: user.id },
    })
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.inspiration.delete({ where: { id: params.id } })
    await logActivity(user.id, 'inspiration.deleted', 'Removed inspiration', { inspirationId: params.id })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('inspiration delete', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
