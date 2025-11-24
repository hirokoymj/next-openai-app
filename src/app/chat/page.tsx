'use client';

import { useState, useRef, useEffect } from 'react';

interface History {
  role: 'user' | 'assistant'; // Role can only be 'user' or 'assistant'
  content: string;
}
export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: prompt },
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Next.js + OpenAI Chat</h1>

      {/* Chat History */}
      <div className="space-y-4 mb-6">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div
              className={`px-4 py-2 rounded-xl max-w-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-black'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-600">
              ⏳ Thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={1}
          className="w-full border p-2 rounded-md"
          placeholder="Ask something..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
}
