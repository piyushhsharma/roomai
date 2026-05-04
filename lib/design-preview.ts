import { mockStyles } from '@/lib/mock-data'

export function isMockResultUrl(url: string | null | undefined) {
  return !url || url.startsWith('mock://')
}

export function styleIdFromMockUrl(url: string | null | undefined) {
  if (!url?.startsWith('mock://')) return null
  return url.slice('mock://'.length) || null
}

export function mockGradientFromStyle(styleId?: string | null) {
  const s = mockStyles.find((x) => x.id === (styleId || 'modern'))
  if (!s) return 'linear-gradient(135deg,#6366f1,#8b5cf6)'
  const [a, b, c] = s.colors
  return `linear-gradient(135deg,${a},${b} 45%,${c})`
}

export function cssBackgroundForDesign(
  resultUrl: string | null | undefined,
  style?: string | null
): string {
  if (resultUrl?.startsWith('mock://')) {
    const sid = styleIdFromMockUrl(resultUrl)
    return mockGradientFromStyle(sid || style)
  }
  if (isMockResultUrl(resultUrl)) {
    return mockGradientFromStyle(style)
  }
  if (!resultUrl) {
    return mockGradientFromStyle(style)
  }
  if (resultUrl.startsWith('data:')) {
    return `url(${resultUrl}) center/cover no-repeat`
  }
  return `url(${resultUrl}) center/cover no-repeat`
}
