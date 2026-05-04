export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { rateLimitGenerate } from '@/lib/rate-limit'
import { canGenerate, recordGeneration } from '@/lib/subscription-usage'
import { runInteriorGenerate } from '@/lib/services/interior-generate'

const bodySchema = z.object({
  styleId: z.string().min(1).max(64),
  roomType: z.string().min(1).max(64),
  palette: z.array(z.string()).max(12).optional(),
  prompt: z.string().max(2000).optional(),
  projectId: z.string().cuid().optional().nullable(),
  uploadedImageId: z.string().cuid().optional().nullable(),
})

export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rl = await rateLimitGenerate(user.id)
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many generation requests. Slow down a bit.' }, { status: 429 })
    }

    const gate = await canGenerate(user.id)
    if (!gate.ok) {
      return NextResponse.json(
        {
          error: 'Daily free generation limit reached.',
          usage: { used: gate.used, cap: gate.cap },
        },
        { status: 403 }
      )
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 })
    }

    const { styleId, roomType, palette, prompt, projectId, uploadedImageId } = parsed.data

    if (projectId) {
      const proj = await prisma.project.findFirst({
        where: { id: projectId, userId: user.id },
      })
      if (!proj) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    let sourceUrl: string | null = null
    if (uploadedImageId) {
      const img = await prisma.uploadedImage.findFirst({
        where: { id: uploadedImageId, userId: user.id },
      })
      if (img) sourceUrl = img.url
    }

    const started = Date.now()
    const gen = await runInteriorGenerate({
      styleId,
      roomType,
      prompt,
      sourceImageUrl: sourceUrl,
    })
    const durationMs = Date.now() - started

    const design = await prisma.design.create({
      data: {
        userId: user.id,
        projectId: projectId ?? undefined,
        uploadedImageId: uploadedImageId ?? undefined,
        prompt: prompt ?? null,
        style: styleId,
        roomType,
        palette: palette ? (palette as object) : undefined,
        resultUrl: gen.outputUrl,
        isMock: gen.isMock,
        durationMs,
        status: 'complete',
      },
    })

    await recordGeneration(user.id)
    await logActivity(user.id, 'design.generated', `Generated ${styleId} design`, {
      designId: design.id,
      isMock: gen.isMock,
    })

    return NextResponse.json({
      design: {
        id: design.id,
        resultUrl: design.resultUrl,
        style: design.style,
        roomType: design.roomType,
        isMock: design.isMock,
        createdAt: design.createdAt,
      },
      usage: { used: gate.used + 1, cap: gate.cap },
      notice: gen.error,
    })
  } catch (e) {
    console.error('design generate', e)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
