'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}
interface RecipeResponse {
  recipe: Recipe;
}

export default function RecipeGeneratorPage() {
  const [prompt, setPrompt] = useState<string>('');

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (prompt: string) => generateRecipe(prompt),
    onError: (error) => {
      console.log(error);
    },
  });

  async function generateRecipe(prompt: string): Promise<RecipeResponse> {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(prompt);
  };

  const renderRecipe = (recipe: Recipe) => (
    <div className="mt-6 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
      <h3 className="text-lg font-semibold mt-4">Ingredients</h3>
      <ul className="list-disc ml-6 mt-2">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mt-4">Steps</h3>
      <ol className="list-decimal ml-6 mt-2 space-y-1">
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Recipe Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE — USER INPUT */}
        <div className="bg-blue-50 shadow p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Input</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Recipe Prompt</label>
              <input
                type="text"
                placeholder="e.g. Chocolate chip cookies"
                className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
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
        <div className="bg-yellow-50 shadow p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Generated Output</h2>

          {!data && (
            <p className="text-gray-500">
              No recipe yet — enter a prompt on the left.
            </p>
          )}

          {data && renderRecipe(data.recipe)}
        </div>
      </div>
    </div>
  );
}
