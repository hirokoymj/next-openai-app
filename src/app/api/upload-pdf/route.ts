import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import pdf from 'pdf-parse';

function chunkText(text: string, chunkSize = 1000, overlap = 100): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks.filter((c) => c.trim().length > 0);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'A PDF file is required.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { text } = await pdf(buffer);

  const chunks = chunkText(text);

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunks,
  });

  const documentId = file.name.replace(/\s+/g, '-').replace(/\.pdf$/i, '');

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.index({ name: 'resume-index' }).namespace(documentId);

  const vectors = embeddings.map((embedding, i) => ({
    id: `${documentId}-chunk-${i}`,
    values: embedding,
    metadata: { text: chunks[i], documentId, chunkIndex: i },
  }));

  await index.upsert({ records: vectors });

  return NextResponse.json({ documentId, chunkCount: chunks.length });
}
