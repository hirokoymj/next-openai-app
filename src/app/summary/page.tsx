'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const sample_text =
  'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.';

const summaryStyles = [
  { label: 'Short', value: 'short' },
  { label: 'Medium', value: 'medium' },
  { label: 'Bullet List', value: 'bullet' },
];

const AISummaryPage = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('short');

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
    mutate(prompt);
  };

  const handleSelectSample = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Text Summary Generator
      </h1>
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
              rows={10}
              className="border rounded p-2 resize-none w-full"
            />

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

            <button
              type="submit"
              disabled={isPending || !prompt}
              className={`w-full py-2 rounded text-white font-semibold transition bg-blue-600`}>
              {isPending ? 'Generating...' : 'Generate Summary'}
            </button>

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
