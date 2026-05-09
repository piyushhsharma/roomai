CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "DesignChunk" (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536),
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "DesignChunk_embedding_idx"
ON "DesignChunk"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
