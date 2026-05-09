import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

type FileDoc = {
  absolutePath: string
  relativePath: string
}

function vectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`
}

function makeId(): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `ck_${Date.now().toString(36)}_${rand}`
}

async function collectMarkdownFiles(rootDir: string): Promise<FileDoc[]> {
  const out: FileDoc[] = []

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push({
          absolutePath: full,
          relativePath: path.relative(rootDir, full),
        })
      }
    }
  }

  await walk(rootDir)
  return out
}

/**
 * Chunk strategy:
 * - Aim ~1600 chars per chunk (~400 tokens rough estimate)
 * - 200 char overlap (~50 tokens rough estimate)
 * - Prefer splitting near paragraph boundaries to preserve semantics
 */
function chunkMarkdown(content: string): string[] {
  const cleaned = content.replace(/\r\n/g, '\n').trim()
  if (!cleaned) return []

  const target = 1600
  const overlap = 200
  const chunks: string[] = []
  let start = 0

  while (start < cleaned.length) {
    let end = Math.min(start + target, cleaned.length)
    if (end < cleaned.length) {
      const nearby = cleaned.lastIndexOf('\n\n', end)
      if (nearby > start + 800) {
        end = nearby
      }
    }

    const chunk = cleaned.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
    if (end >= cleaned.length) break
    start = Math.max(0, end - overlap)
  }

  return chunks
}

function deriveCategoryAndSource(relativePath: string): { category: string; source: string } {
  const normalized = relativePath.replace(/\\/g, '/')
  const parts = normalized.split('/')
  const category = parts[0] || 'general'
  const filename = parts[parts.length - 1] || 'unknown'
  const source = filename.replace(/\.md$/i, '')
  return { category, source }
}

async function main() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY for ingestion embeddings.')
    }

    const openai = new OpenAI({ apiKey })
    const knowledgeRoot = path.join(process.cwd(), 'data', 'knowledge')
    const files = await collectMarkdownFiles(knowledgeRoot)

    let totalInserted = 0

    for (const file of files) {
      const raw = await fs.readFile(file.absolutePath, 'utf8')
      const chunks = chunkMarkdown(raw)
      const { category, source } = deriveCategoryAndSource(file.relativePath)

      for (let i = 0; i < chunks.length; i += 1) {
        const chunk = chunks[i]

        const exists = await prisma.designChunk.findFirst({
          where: {
            source,
            content: chunk,
          },
          select: { id: true },
        })

        if (exists) continue

        const embeddingRes = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk,
        })
        const embedding = embeddingRes.data[0]?.embedding
        if (!embedding || embedding.length !== 1536) {
          throw new Error(`Unexpected embedding shape for ${source} chunk ${i + 1}`)
        }

        const vector = vectorLiteral(embedding)
        const id = makeId()

        // Use raw SQL for vector insertion because Prisma does not natively serialize pgvector values.
        await prisma.$executeRaw(
          Prisma.sql`INSERT INTO "DesignChunk" (id, content, embedding, source, category, "createdAt")
                     VALUES (${id}, ${chunk}, ${vector}::vector, ${source}, ${category}, NOW())`
        )

        totalInserted += 1
        console.log(`Embedded chunk ${i + 1} of ${chunks.length} from [${source}]`)
      }
    }

    console.log(`Ingestion complete. Total chunks inserted: ${totalInserted}`)
  } catch (error) {
    console.error('Ingestion failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

void main()
