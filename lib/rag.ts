import OpenAI from 'openai'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { RAGChunk } from '@/types/rag'

type RawRagRow = {
  id: string
  content: string
  source: string
  category: string
  similarity: number | string
}

function vectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for RAG retrieval')
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function retrieveRelevantChunks(query: string, topK: number = 5): Promise<RAGChunk[]> {
  try {
    const safeTopK = Math.max(1, Math.min(20, topK))
    const openai = getOpenAIClient()

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })
    const embedding = embeddingRes.data[0]?.embedding
    if (!embedding || embedding.length !== 1536) {
      throw new Error('Invalid embedding shape returned by OpenAI')
    }

    const literal = vectorLiteral(embedding)

    // Vector similarity query:
    // `<=>` computes cosine distance for pgvector. Similarity is transformed to (1 - distance).
    const rows = await prisma.$queryRaw<RawRagRow[]>(
      Prisma.sql`SELECT id, content, source, category,
                        1 - (embedding <=> ${literal}::vector) as similarity
                 FROM "DesignChunk"
                 ORDER BY embedding <=> ${literal}::vector
                 LIMIT ${safeTopK}`
    )

    return rows
      .map((row) => ({
        id: row.id,
        content: row.content,
        source: row.source,
        category: row.category,
        similarity: Number(row.similarity),
      }))
      .sort((a, b) => b.similarity - a.similarity)
  } catch (error) {
    console.error('retrieveRelevantChunks failed:', error)
    throw new Error('Failed to retrieve relevant design chunks')
  }
}

export async function buildRAGContext(query: string): Promise<{ context: string; chunks: RAGChunk[] }> {
  try {
    const chunks = await retrieveRelevantChunks(query, 5)

    const context = chunks
      .map(
        (chunk, index) =>
          `[DESIGN PRINCIPLE ${index + 1} — ${chunk.category} / ${chunk.source}]\n${chunk.content}`
      )
      .join('\n\n')

    return { context, chunks }
  } catch (error) {
    console.error('buildRAGContext failed:', error)
    throw new Error('Failed to build RAG context')
  }
}
