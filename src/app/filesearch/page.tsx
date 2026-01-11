'use client';

import { useState } from 'react';
import { uploadFile, askQuestion } from './actions/fileSearch';
import { AiModelHeader } from '@/components/AiModelHeader';

const headerInfo = {
  title: 'AI Document Search(RAG)',
  provider: 'Google',
  model: 'Gemini 2.5 Flash ',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/tree/main/src/app/filesearch',
  referenceUrl: 'https://ai.google.dev/gemini-api/docs/file-search',
  referenceLabel: 'Gemini File Search (RAG)',
  flow: 'File → Embeddings → Store → Semantic Search → Response',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData);

    if (result.success) {
      setUploadStatus(
        'File successfully added to the File Search store. You can now start semantic search!'
      );
    } else {
      setUploadStatus(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');

    const result = await askQuestion(question);

    if (result.success) {
      setAnswer(result.answer || '');
    } else {
      setAnswer(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <AiModelHeader headerInfo={headerInfo} />

      <div className="max-w-4xl mx-auto space-y-10">
        <section className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Upload PDF</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (!selectedFile) return;
              if (selectedFile.size > MAX_FILE_SIZE) {
                alert('File size must be 10 MB or less.');
                e.target.value = ''; // reset input
                setFile(null);
                return;
              }
              setFile(selectedFile);
            }}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={!file || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
              Upload a file
            </button>
          </div>

          {uploadStatus && (
            <p
              className={`text-sm ${
                uploadStatus.startsWith('Error')
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
              {uploadStatus}
            </p>
          )}
        </section>

        {/* Chat Section */}
        <section className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Semantic Search</h2>

          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What skills does this resume highlight?"
            className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleAskQuestion}
            disabled={!question.trim() || loading}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
            Search Document
          </button>

          {loading && <p className="text-sm text-gray-500">Processing...</p>}

          {answer && (
            <div className="mt-4 p-4 bg-gray-50 border rounded">
              <h3 className="font-semibold mb-2">Answer</h3>
              <p className="whitespace-pre-wrap text-gray-900">{answer}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
