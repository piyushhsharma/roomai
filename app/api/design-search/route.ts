export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { retrieveRelevantChunks } from '@/lib/rag'
import type { DesignSearchResponse } from '@/types/rag'

const schema = z.object({
  query: z.string().min(1, 'Query is required'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const chunks = await retrieveRelevantChunks(parsed.data.query, 5)
    const response: DesignSearchResponse = { chunks }
    return NextResponse.json(response)
  } catch (error) {
    console.error('design-search failed:', error)
    return NextResponse.json({ error: 'Failed to perform semantic design search' }, { status: 500 })
  }
}
