import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt || prompt.trim() === '') {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  try {
    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
    });

    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      return NextResponse.json({ imageUrl });
    }
  } catch (err: any) {
    console.error('Failed to create an image:', err);

    return NextResponse.json(
      { error: 'Failed to create an image. Try again.' },
      { status: 500 }
    );
  }
}
