'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validateField } from '@/utils/formValidation';
import { AiModelHeader } from '@/components/AiModelHeader';

const sample_text =
  'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.';

const summaryStyles = [
  { label: 'Short', value: 'short' },
  { label: 'Medium', value: 'medium' },
  { label: 'Bullet List', value: 'bullet' },
];

const headerInfo = {
  title: 'AI: Summary generator',
  provider: 'OpenAI',
  model: 'GPT-5 nano',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/tree/main/src/app/summary',
  referenceUrl:
    'https://platform.openai.com/docs/guides/text#message-roles-and-instruction-following',
  referenceLabel: 'Instructions parameter',
  stack: ['Next.js', 'OpenAI', 'TansStack Query', 'Responses API'],
};

const AISummaryPage = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('short');
  const [errors, setErrors] = useState({ prompt: '' });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async (prompt: string) => {
      return await fetch('/api/summary', {
        method: 'POST',
        body: JSON.stringify({ prompt, style }),
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => response.json());
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      prompt: validateField('Prompt', prompt),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((msg) => msg !== '')) return;
    mutate(prompt);
  };

  const handleSelectSample = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrompt(e.target.value);
  };
  const handleReset = () => {
    setPrompt('');
    setErrors({ prompt: '' });
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <AiModelHeader headerInfo={headerInfo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE — INPUT */}
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50 shadow p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Input</h2>
          <div className="flex flex-col space-y-3">
            <div>
              <label className="block font-medium mb-1">Prompt</label>
              <select
                value={prompt}
                onChange={handleSelectSample}
                className="border rounded px-2 py-1 w-full">
                <option value="">---Please select a sample text---</option>
                <option value={sample_text}>Sample Text 1</option>
              </select>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onBlur={() => {
                setErrors((prev) => ({
                  ...prev,
                  prompt: validateField('Prompt', prompt),
                }));
              }}
              rows={10}
              className="border rounded p-2 resize-none w-full"
            />
            {errors.prompt && (
              <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>
            )}
            <div>
              <label className="block font-medium mb-1">Summary Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="border rounded px-2 py-1 w-full">
                {summaryStyles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className={`w-[70%] py-2 rounded text-white font-semibold transition
      ${isPending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
    `}>
                {isPending ? 'Generating...' : 'Generate Summary'}
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="w-[30%] py-2 rounded border border-gray-400 font-semibold text-gray-700 hover:bg-gray-100 transition">
                Reset
              </button>
            </div>

            {isError && (
              <p className="text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>

        {/* RIGHT SIDE — OUTPUT */}
        <div className="bg-yellow-50 shadow p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">AI Output</h2>

          {isPending ? (
            <p className="text-gray-500 animate-pulse">Generating summary...</p>
          ) : data?.reply ? (
            <p className="whitespace-pre-line">{data.reply}</p>
          ) : (
            <p className="text-gray-400">Your summary will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

export default AISummaryPage;

// {
//     "reply": "Eiffel Tower: 324 m tall with a 125 m square base. It was the world’s tallest and first over 300 m, holding the title 41 years until the Chrysler Building (1930). A 1957 aerial makes it 5.2 m taller. Tallest in Paris, second free‑standing after the Millau Viaduct."
// }
