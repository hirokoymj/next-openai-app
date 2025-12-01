import { NextResponse } from 'next/server';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { openai } from '@/lib/openai';

const RecipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export async function POST(req: Request) {
  const { recipe } = await req.json();

  if (!recipe || recipe.trim() === '') {
    return NextResponse.json({ error: 'Recipe is required.' }, { status: 400 });
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
          content: `Generate a recipe for: ${recipe}. Return only title, ingredients[], and steps[].`,
        },
      ],
      text: {
        format: zodTextFormat(RecipeSchema, 'recipe'),
      },
    });

    const output = response.output_parsed;
    return NextResponse.json({ output });
  } catch (err: any) {
    console.error('Schema parse error:', err);

    return NextResponse.json(
      { error: 'Failed to parse recipe. Try again.' },
      { status: 500 }
    );
  }
}
