'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Request failed.' });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">PDF Search</h1>

      {/* Search Input */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Ask something from the PDF..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 animate-pulse">Searching… please wait.</p>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
