'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validateField } from '@/utils/formValidation';
import { Recipe, Errors } from '@/types';
import { AiModelHeader } from '@/components/AiModelHeader';

interface RecipeResponse {
  output: Recipe;
}

const headerInfo = {
  title: 'AI: Recipe generator',
  provider: 'OpenAI',
  model: 'GPT-5 nano',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/api/recipe/route.ts',
  referenceUrl: 'https://platform.openai.com/docs/guides/structured-outputs',
  referenceLabel: 'Structured output',
  stack: ['Next.js', 'OpenAI', 'TansStack Query'],
};

export default function RecipeGeneratorPage() {
  const [recipe, setRecipe] = useState<string>('');
  const [errors, setErrors] = useState<Errors<'recipe'>>({ recipe: '' });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (recipe: string) => generateRecipe(recipe),
    onError: (error) => {
      console.log(error);
    },
  });

  async function generateRecipe(recipe: string): Promise<RecipeResponse> {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      body: JSON.stringify({ recipe }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      recipe: validateField('Recipe', recipe),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    mutate(recipe);
  };

  const renderRecipe = (data: RecipeResponse) => {
    const { title, ingredients, steps } = data.output;
    return (
      <div className="mt-6 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <h3 className="text-lg font-semibold mt-4">Ingredients</h3>
        <ul className="list-disc ml-6 mt-2">
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mt-4">Steps</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-1">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <AiModelHeader headerInfo={headerInfo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE — USER INPUT */}
        <div className="bg-blue-50 shadow p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Input</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Recipe</label>
              <input
                type="text"
                placeholder="e.g. Chocolate chip cookies"
                className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                onBlur={() => {
                  setErrors((prev) => ({
                    ...prev,
                    recipe: validateField('Recipe', recipe),
                  }));
                }}
              />
              {errors.recipe && (
                <p className="text-red-500 text-sm mt-1">{errors.recipe}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-2 rounded text-white font-semibold transition
              ${isPending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
            `}>
              {isPending ? 'Generating...' : 'Generate Recipe'}
            </button>
          </form>

          {isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              Something went wrong. Please try again.
            </div>
          )}
        </div>

        {/* RIGHT SIDE — GENERATED OUTPUT */}
        <div className="bg-green-50 shadow p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Generated Output</h2>

          {!data && (
            <p className="text-gray-500">
              No recipe yet — enter a prompt on the left.
            </p>
          )}

          {data && renderRecipe(data)}
        </div>
      </div>
      {/* Example Prompt Table */}
      <div className="mt-10 bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-xl font-bold px-4 py-3 bg-gray-100 border-b">
          Example Prompts
        </h2>

        <table className="w-full text-left">
          <tbody>
            {[
              'Chocolate Chip Cookies',
              'English Muffins',
              'Spaghetti Carbonara',
            ].map((item, idx) => (
              <tr
                key={idx}
                onClick={() => {
                  setRecipe(item);
                  setErrors({ recipe: '' });
                }}
                className="cursor-pointer hover:bg-blue-50 transition">
                <td className="px-4 py-3 border-b text-gray-700">{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
