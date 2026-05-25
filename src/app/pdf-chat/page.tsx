'use client';

import { useState, useRef } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function PdfChatPage() {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chunkCount, setChunkCount] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: { preventDefault(): void }) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
    const data = await res.json();
    setDocumentId(data.documentId);
    setChunkCount(data.chunkCount);
    setMessages([]);
    setUploading(false);
  }

  async function handleSend(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!input.trim() || !documentId) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/pdf-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, documentId }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: assistantText },
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Chat with a PDF</h1>

      <form onSubmit={handleUpload} className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept="application/pdf" className="text-sm" />
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>

      {documentId && (
        <p className="text-sm text-green-600">
          Ready: <strong>{documentId}</strong> ({chunkCount} chunks indexed)
        </p>
      )}

      {documentId && (
        <>
          <div className="border rounded p-4 h-96 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm">Ask a question about your PDF...</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-sm max-w-xs ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border text-gray-800'
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
