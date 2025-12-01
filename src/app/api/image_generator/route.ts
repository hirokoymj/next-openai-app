import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await openai.images.generate({
      model: 'dall-e-2', // or 'dall-e-3'
      prompt,
      size: '512x512', // smaller size for cheaper/faster generation
    });

    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error('Error generating image:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
