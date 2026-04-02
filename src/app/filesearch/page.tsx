'use client';

import { useActionState } from 'react';
import { uploadFileAction, askQuestionAction } from './actions';

export default function FileSearchPage() {
  const [uploadState, uploadFormAction, isUploading] = useActionState(
    uploadFileAction,
    null,
  );

  const [searchState, searchFormAction, isSearching] = useActionState(
    askQuestionAction,
    null,
  );
  const currentStoreName = uploadState?.storeName || searchState?.storeName;
  const askQuestionWithStore = askQuestionAction.bind(
    null,
    null,
    currentStoreName,
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Upload Section */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">1. Knowledge Base</h2>
          <form action={uploadFormAction} className="space-y-4">
            <input
              name="file"
              type="file"
              accept=".pdf,.txt"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400">
              {isUploading ? 'Processing File...' : 'Upload & Index'}
            </button>
          </form>
          {uploadState?.message && (
            <p className="mt-2 text-green-600 text-sm">{uploadState.message}</p>
          )}
          {uploadState?.error && (
            <p className="mt-2 text-red-600 text-sm">{uploadState.error}</p>
          )}
        </section>

        {/* Search Section */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">2. Semantic Search</h2>
          <form action={searchFormAction} className="space-y-4">
            <textarea
              name="question"
              rows={3}
              placeholder="Ask a question about your documents..."
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
              {isSearching ? 'Searching...' : 'Run Query'}
            </button>
          </form>

          {searchState?.answer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded">
              <h3 className="font-bold text-blue-800 mb-2">
                Gemini's Insights:
              </h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {searchState.answer}
              </p>
            </div>
          )}
          {searchState?.error && (
            <p className="mt-2 text-red-600 text-sm">{searchState.error}</p>
          )}
        </section>
      </div>
    </div>
  );
}
