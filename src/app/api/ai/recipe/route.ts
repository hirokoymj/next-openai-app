import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { recipe } = await req.json();

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe is required' },
        { status: 400 }
      );
    }

    const prompt = `
Create a detailed cooking recipe for: "${recipe}"
Return only JSON with:
- recipeName
- ingredients (array of strings)
- steps (array of strings)
`;

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['recipeName', 'ingredients', 'steps'],
        },
      },
    });

    let fullText = '';

    for await (const chunk of stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      fullText += chunkText;
    }

    if (!fullText) {
      throw new Error('Empty streaming response from Gemini');
    }

    const data = JSON.parse(fullText);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}
