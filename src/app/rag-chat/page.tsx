// app/chat/page.tsx
'use client';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>💬 Ask about Hiroko's Resume</h1>

      {/* Message history */}
      <div style={{ minHeight: 300, marginBottom: 20 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 12 }}>
            <strong>{m.role === 'user' ? '🙋 You' : '🤖 AI'}:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{m.content}</p>
          </div>
        ))}
        {isLoading && <p>⏳ Thinking...</p>}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything — e.g. What cloud certifications does Hiroko have?"
          style={{ flex: 1, padding: '10px', fontSize: 16 }}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}