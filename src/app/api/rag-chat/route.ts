import { openai } from '@ai-sdk/openai';
import { streamText, embed, convertToModelMessages } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: Request) {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const { messages } = await req.json();

  // Extract the user's latest question from UIMessage parts
  const lastMessage = messages[messages.length - 1];
  const question =
    lastMessage.parts?.find((p: { type: string }) => p.type === 'text')?.text ??
    '';

  // 1. Embed the user's question
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: question,
  });

  // 2. Search Pinecone — find the 3 most relevant resume chunks
  const index = pinecone.index('resume-index');
  const results = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });

  // 3. Build context string from matches
  const context = results.matches
    .map((match) => match.metadata?.text)
    .join('\n\n');

  // 4. Stream GPT-4o-mini response using the context
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful assistant answering questions about Hiroko's resume and experience.
Answer only based on the context below. If the answer is not in the context, say "I don't have that information."

Context:
${context}`,
    messages: await convertToModelMessages(messages),
  });

  return result.toTextStreamResponse();
}
