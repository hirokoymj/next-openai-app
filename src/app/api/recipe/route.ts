import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const RecipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt || prompt.trim() === '') {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  try {
    const response = await openai.responses.parse({
      model: 'gpt-5-nano',
      input: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that returns recipe data strictly following the JSON schema provided. Use natural, concise values.',
        },
        {
          role: 'user',
          content: `Generate a recipe for: ${prompt}. Return only title, ingredients[], and steps[].`,
        },
      ],
      text: {
        format: zodTextFormat(RecipeSchema, 'recipe'),
      },
    });

    const recipe = response.output_parsed;
    return NextResponse.json({ recipe });
  } catch (err: any) {
    console.error('Schema parse error:', err);

    return NextResponse.json(
      { error: 'Failed to parse recipe. Try again.' },
      { status: 500 }
    );
  }
}
