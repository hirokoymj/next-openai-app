import fs from 'fs';
import pdf from 'pdf-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

async function ingest() {
  const pdfBuffer = fs.readFileSync('./resume.pdf');
  const { text } = await pdf(pdfBuffer);

  const chunks = text.match(/.{1,500}/gs) || [];

  const index = pinecone.index('resume-index');

  for (let i = 0; i < chunks.length; i++) {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: chunks[i],
    });

    await index.upsert({
      records: [
        {
          id: `chunk-${i}`,
          values: embedding,
          metadata: { text: chunks[i] },
        },
      ],
    });

    console.log(`✅ Uploaded chunk ${i + 1} of ${chunks.length}`);
  }
}

ingest();
