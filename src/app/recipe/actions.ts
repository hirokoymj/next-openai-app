'use server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { traceable } from 'langsmith/traceable';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const recipeSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

type Recipe = z.infer<typeof recipeSchema>;

export type RecipeState =
  | { success: true; data: Recipe; message?: string }
  | { success: false; message: string; data?: Recipe }
  | null;

const getAiRecipe = traceable(
  async (recipeTitle: string): Promise<Recipe> => {
    const prompt = `
Create a detailed cooking recipe for "${recipeTitle}".

Return ONLY valid JSON in the following format:

{
  "recipeName": string,
  "ingredients": string[],
  "steps": string[]
}

No markdown. No extra text.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(recipeSchema as any),
      },
    });

    if (!response.text) {
      throw new Error('Empty model response');
    }

    return recipeSchema.parse(JSON.parse(response.text));
  },
  { name: 'Gemini Recipe Generation', run_type: 'llm' },
);

// --- The Server Action (Called by useActionState) ---
export async function submitRecipe(
  prevState: RecipeState,
  formData: FormData,
): Promise<RecipeState> {
  const recipeTitle = formData.get('recipe') as string;

  if (!recipeTitle || recipeTitle.length > 100) {
    return {
      success: false,
      message: 'Please provide a valid recipe name (max 100 chars).',
    };
  }

  try {
    const data = await getAiRecipe(recipeTitle);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate a recipe. Check LangSmith for details.',
    };
  }
}
