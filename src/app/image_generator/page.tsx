'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validateField } from '@/utils/formValidation';
import { AiModelHeader } from '@/components/AiModelHeader';
import { ExampleTable } from '@/components/ExampleTable';
import { Errors } from '@/types';

interface ImageResponse {
  imageUrl: string;
}

const headerInfo = {
  title: 'AI: Image Generator',
  provider: 'OpenAI',
  model: 'GPT Image 1',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/api/image_generator/route.ts',
  referenceUrl: 'https://platform.openai.com/docs/models/gpt-image-1',
  referenceLabel: 'GPT Image 1',
  stack: ['Next.js', 'OpenAI', 'TansStack Query'],
};

export default function AIImageGeneratorPage() {
  const [prompt, setPrompt] = useState<string>('');
  const [errors, setErrors] = useState<Errors<'prompt'>>({ prompt: '' });
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

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

    const newErrors = {
      prompt: validateField('Prompt', prompt.trim()),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    mutate(prompt);
  };
  const handleReset = () => {
    setPrompt('');
    setSelectedImageUrl(null);
    setErrors({ prompt: '' });
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <AiModelHeader headerInfo={headerInfo} />

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
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  prompt: validateField('Prompt', prompt),
                }))
              }
              className="w-full p-3 border border-gray-300 rounded focus:outline-blue-500"
            />
            {errors.prompt && (
              <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>
            )}

            <div className="flex gap-3">
              {' '}
              <button
                type="submit"
                //disabled={isPending}
                disabled={true}
                className="w-[70%] py-2 rounded text-white font-semibold transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {isPending ? 'Generating...' : 'Generate an Image'}
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="w-[30%] py-2 rounded border border-gray-400 font-semibold text-gray-700 hover:bg-gray-100 transition">
                Reset
              </button>
            </div>
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
              className="rounded shadow-lg"
            />
          ) : selectedImageUrl ? (
            <img
              src={`images/${selectedImageUrl}`}
              alt="Example"
              width={400}
              className="rounded shadow-lg"
            />
          ) : (
            <p className="text-gray-500">Generated image will appear here.</p>
          )}
        </div>
      </div>
      {/* Example Prompt Table */}
      <ExampleTable
        examples={[
          { prompt: 'shiba inu', image: '/shiba-inu.png' },
          { prompt: 'Sunny Waikiki beach', image: '/waikiki-beach.png' },
        ]}
        onSelect={(row) => {
          setPrompt(row.prompt);
          setSelectedImageUrl(row.image);
          setErrors({ prompt: '' });
        }}
      />
    </div>
  );
}
