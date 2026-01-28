'use server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const schema = z.object({
  recipe: z.string().max(100),
});

const recipeSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

type Recipe = {
  recipeName: string;
  ingredients: string[];
  steps: string[];
};

export type RecipeState =
  | { success: true; data: Recipe; message?: string }
  | { success: false; message: string; data?: Recipe }
  | null;

export async function submitRecipe(
  prevState: RecipeState,
  formData: FormData,
): Promise<RecipeState> {
  const validatedFields = schema.safeParse({
    recipe: formData.get('recipe'),
  });

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid Input' };
  }

  try {
    const recipe = validatedFields.data.recipe;
    const prompt = `
Create a detailed cooking recipe for: "${recipe}"
Return only JSON with:
- recipeName
- ingredients (array of strings)
- steps (array of strings)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(recipeSchema as any),
      },
    });

    const textOutput = response.text ?? '';

    if (!textOutput) {
      throw new Error('No content generated');
    }

    const parsedData = recipeSchema.parse(JSON.parse(textOutput));
    return {
      success: true,
      data: {
        recipeName: parsedData.recipeName,
        ingredients: parsedData.ingredients,
        steps: parsedData.steps,
      },
    };
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate a recipe. Please try again later.',
    };
  }
}
