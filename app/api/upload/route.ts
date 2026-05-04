export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { rateLimitApi } from '@/lib/rate-limit'

const MAX_BYTES = 2 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
    const rl = await rateLimitApi(`upload:${ip}`)
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many uploads' }, { status: 429 })
    }

    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: 'Image too large (max 2MB for free tier demo).' }, { status: 400 })
    }

    const dataUrl = `data:${file.type};base64,${buf.toString('base64')}`

    const row = await prisma.uploadedImage.create({
      data: {
        userId: user.id,
        url: dataUrl,
        name: file.name,
        mimeType: file.type,
        size: buf.length,
      },
    })

    return NextResponse.json({
      id: row.id,
      url: row.url,
      name: row.name,
      size: row.size,
    })
  } catch (e) {
    console.error('upload', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
