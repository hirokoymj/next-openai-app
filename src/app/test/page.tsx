'use client';
import OpenAI from 'openai';
import { useState } from 'react';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function HelloPage() {
  const result = await client.images.generate({
    model: 'dall-e-3',
    prompt: 'a white siamese cat',
    size: '1024x1024',
  });

  if (result.data && result.data.length > 0) {
    const url = result.data[0].url;
    console.log(url);
  } else {
    console.error('No image URL found in the response.');
  }

  return (
    <div>
      <h1>Hello from Next.js!</h1>
      {result.data && result.data.length > 0 && (
        <img src={result.data[0].url} width="300" height="auto" />
      )}
    </div>
  );
}
