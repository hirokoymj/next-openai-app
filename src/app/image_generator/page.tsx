'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface ImageResponse {
  imageUrl: string;
}

export default function AIImageGeneratorPage() {
  const [prompt, setPrompt] = useState<string>('');

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (prompt: string) => generateImage(prompt),
    onError: (err) => {
      console.error('Error generating image:', err);
    },
  });

  async function generateImage(prompt: string): Promise<ImageResponse> {
    const response = await fetch('/api/image_generator', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to generate image.');
    }

    const result: ImageResponse = await response.json();
    return result;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutate(prompt);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        AI Image Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE — INPUT */}
        <div className="bg-blue-50 shadow p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">Input</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter a prompt (e.g., a white siamese cat)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500"
            />

            <button
              type="submit"
              disabled={isPending || !prompt.trim()}
              className={`w-full py-2 rounded text-white font-semibold transition
            ${
              isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              {isPending ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              Failed to generate image. Please try again.
            </div>
          )}

          {isPending && (
            <p className="mt-4 text-gray-500 animate-pulse">
              Generating image...
            </p>
          )}
        </div>

        {/* RIGHT SIDE — OUTPUT */}
        <div className="bg-green-50 shadow p-6 rounded-lg flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">AI Output</h2>

          {data?.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="Generated AI"
              width={400}
              style={{ height: 'auto' }}
              className="rounded shadow-lg"
            />
          ) : (
            <p className="text-gray-500">Generated image will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
