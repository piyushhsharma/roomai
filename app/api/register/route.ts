export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimitApi } from '@/lib/rate-limit'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
    const rl = await rateLimitApi(ip)
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 })
    }

    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const normalized = email.toLowerCase().trim()

    const existing = await prisma.user.findUnique({ where: { email: normalized } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashed = await hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email: normalized,
        password: hashed,
        subscription: { create: {} },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('register', e)
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }
}
