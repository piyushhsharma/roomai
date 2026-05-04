export type GenerateInput = {
  styleId: string
  roomType: string
  prompt?: string
  sourceImageUrl?: string | null
}

export async function runInteriorGenerate(
  input: GenerateInput
): Promise<{ outputUrl: string; isMock: boolean; error?: string }> {
  const forceMock = process.env.MOCK_MODE === 'true'
  const token = process.env.REPLICATE_API_TOKEN

  if (forceMock || !token) {
    return { outputUrl: `mock://${input.styleId}`, isMock: true }
  }

  try {
    const Replicate = (await import('replicate')).default
    const replicate = new Replicate({ auth: token })

    const basePrompt = [
      'Professional interior design photograph, editorial quality,',
      input.roomType.replace(/-/g, ' '),
      'room,',
      input.styleId.replace(/-/g, ' '),
      'style.',
      input.prompt?.trim() || 'balanced lighting, cohesive materials, realistic proportions.',
    ].join(' ')

    const modelRef = (process.env.REPLICATE_MODEL?.trim() || 'black-forest-labs/flux-schnell') as `${string}/${string}`

    const out = await replicate.run(modelRef, {
      input: {
        prompt: basePrompt,
      },
    })

    const url = Array.isArray(out) ? out[0] : out
    const outputUrl = typeof url === 'string' ? url : url != null ? String(url) : ''
    if (!outputUrl) {
      return { outputUrl: `mock://${input.styleId}`, isMock: true }
    }
    return { outputUrl, isMock: false }
  } catch (e) {
    console.error('replicate', e)
    return { outputUrl: `mock://${input.styleId}`, isMock: true, error: 'Replicate failed; used preview mode.' }
  }
}
