export type RAGChunk = {
  id: string
  content: string
  source: string
  category: string
  similarity: number
}

export type RAGResponse = {
  context: string
  chunks: RAGChunk[]
}

export type DesignSearchResponse = {
  chunks: RAGChunk[]
}
