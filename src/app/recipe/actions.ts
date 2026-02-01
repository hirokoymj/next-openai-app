'use server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { traceable } from 'langsmith/traceable';
import { Client } from 'langsmith';
import * as hub from 'langchain/hub';

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

interface RecipeGenerationResponse {
  recipeJson: string;
  usage_metadata: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const generateRecipeJson = traceable(
  async (
    userInput: string,
    instructions: string,
  ): Promise<RecipeGenerationResponse> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: userInput,
      config: {
        systemInstruction: instructions,
        responseMimeType: 'application/json',
        responseJsonSchema: zodToJsonSchema(recipeSchema as any),
      },
    });

    const textOutput = response.text?.trim();
    if (!textOutput) throw new Error('Empty response');

    return {
      recipeJson: textOutput,
      usage_metadata: {
        prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        completion_tokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        total_tokens: response.usageMetadata?.totalTokenCount ?? 0,
      },
    };
  },
  {
    name: 'Gemini Recipe Generation',
    run_type: 'llm',
    metadata: { env: ENV, app: 'ai-recipe-generator' },
  },
);

const getAiRecipe = async (recipeTitle: string): Promise<Recipe> => {
  const promptTemplate = await hub.pull('recipe-generator:accafe0b');

  const systemText = (promptTemplate as any).promptMessages[0].prompt.template;

  const result = await generateRecipeJson(recipeTitle, systemText);

  return recipeSchema.parse(JSON.parse(result.recipeJson));
};

// --- The Server Action ---
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
    await lsClient.flush();
    return { success: true, data: data };
  } catch (error) {
    await lsClient.flush();
    console.error('Recipe Generation Error:', error);
    return {
      success: false,
      message: 'Failed to generate a recipe. Check LangSmith for details.',
    };
  }
}
