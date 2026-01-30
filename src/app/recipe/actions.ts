'use server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { traceable } from 'langsmith/traceable';
import { Client } from 'langsmith'; // Changed from getClient

const lsClient = new Client();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const recipeSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

type Recipe = z.infer<typeof recipeSchema>;

const ENV = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';

export type RecipeState =
  | { success: true; data: Recipe; message?: string }
  | { success: false; message: string; data?: Recipe }
  | null;

const generateRecipeJson = traceable(
  async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(recipeSchema as any),
      },
    });

    const textOutput = response.text?.trim();
    if (!textOutput) {
      throw new Error('Empty model response from Gemini');
    }

    return textOutput;
  },
  {
    name: 'Gemini Recipe Generation',
    run_type: 'llm',
    metadata: {
      env: ENV,
      app: 'ai-recipe-generator',
    },
  },
);

const getAiRecipe = async (recipeTitle: string): Promise<Recipe> => {
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

  const rawJson = await generateRecipeJson(prompt);
  return recipeSchema.parse(JSON.parse(rawJson));
};

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

    // This is the magic line for Vercel/Serverless:
    // It forces the background trace buffer to empty before the function closes.
    await lsClient.flush();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    // Flush even on error so you can see why it failed in LangSmith
    await lsClient.flush();

    console.error('Recipe Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate a recipe. Check LangSmith for details.',
    };
  }
}
