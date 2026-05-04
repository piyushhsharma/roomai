import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type LimitResult = { success: boolean; remaining?: number; reset?: number }

const memory = new Map<string, { count: number; reset: number }>()

function memoryLimit(key: string, max: number, windowMs: number): LimitResult {
  const now = Date.now()
  const cur = memory.get(key)
  if (!cur || now > cur.reset) {
    memory.set(key, { count: 1, reset: now + windowMs })
    return { success: true, remaining: max - 1, reset: now + windowMs }
  }
  if (cur.count >= max) {
    return { success: false, remaining: 0, reset: cur.reset }
  }
  cur.count += 1
  return { success: true, remaining: max - cur.count, reset: cur.reset }
}

let edgeLimiter: Ratelimit | null = null

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (redisUrl && redisToken) {
  edgeLimiter = new Ratelimit({
    redis: new Redis({ url: redisUrl, token: redisToken }),
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: false,
    prefix: 'roomai',
  })
}

export async function rateLimitGenerate(userId: string): Promise<LimitResult> {
  if (edgeLimiter) {
    const res = await edgeLimiter.limit(`gen:${userId}`)
    return { success: res.success, remaining: res.remaining, reset: res.reset }
  }
  return memoryLimit(`gen:${userId}`, 20, 60_000)
}

export async function rateLimitApi(ip: string): Promise<LimitResult> {
  if (edgeLimiter) {
    const res = await edgeLimiter.limit(`api:${ip}`)
    return { success: res.success, remaining: res.remaining, reset: res.reset }
  }
  return memoryLimit(`api:${ip}`, 120, 60_000)
}
