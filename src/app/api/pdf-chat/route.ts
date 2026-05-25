import { NextRequest } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';

export async function POST(req: NextRequest) {
  const { messages, documentId } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const question = lastMessage.content as string;

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: question,
  });

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.index({ name: 'resume-index' }).namespace(documentId);

  const results = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  const context = results.matches
    .map((match) => match.metadata?.text)
    .join('\n\n');

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful assistant answering questions about a PDF document.
Answer only based on the context below. If the answer is not in the context, say "I don't have that information."

Context:
${context}`,
    messages,
  });

  return result.toTextStreamResponse();
}
