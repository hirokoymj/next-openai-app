'use client';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, isTextUIPart } from 'ai';
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/PageHeader';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const headerInfo = {
  title: 'RAG Chat Demo',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/rag-chat',
  stack: [
    'Next.js (App Router)',
    'Vercel AI SDK',
    'OpenAI (text-embedding-3-small, GPT-4o-mini)',
    'Pinecone',
  ],
};

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/rag-chat' }),
  });
  const [input, setInput] = useState('');
  const [timestamps, setTimestamps] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Record timestamp when a new message appears
  useEffect(() => {
    messages.forEach((m) => {
      if (!timestamps[m.id]) {
        const time = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setTimestamps((prev) => ({ ...prev, [m.id]: time }));
      }
    });
  }, [messages]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <Box sx={{ flexGrow: 1, mx: 2 }}>
      <PageHeader headerInfo={headerInfo} />

      <Paper variant="outlined" sx={{ p: 2, maxWidth: 700, mx: 'auto' }}>
        {/* Title */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          💬 Ask about Hiroko&apos;s Resume
        </Typography>

        {/* Example prompts */}
        <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
          Example prompts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {[
            'What cloud certifications does Hiroko have?',
            'What programming languages does Hiroko know?',
            'What companies has Hiroko worked at?',
          ].map((prompt) => (
            <Button
              key={prompt}
              size="small"
              variant="outlined"
              onClick={() => {
                sendMessage({ text: prompt });
              }}
              sx={{ textTransform: 'none', fontSize: 12 }}>
              {prompt}
            </Button>
          ))}
        </Box>

        {/* Message history */}
        <Box
          sx={{
            minHeight: 300,
            maxHeight: 500,
            overflowY: 'auto',
            mb: 2,
            p: 1.5,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}>
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <Box
                key={m.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}>
                {/* Bubble */}
                <Box
                  sx={{
                    maxWidth: '75%',
                    px: 2,
                    py: 1.25,
                    borderRadius: isUser
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    bgcolor: isUser ? 'primary.main' : 'white',
                    color: isUser ? 'white' : 'text.primary',
                    boxShadow: 1,
                  }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {m.parts
                      .filter(isTextUIPart)
                      .map((p) => p.text)
                      .join('')}
                  </Typography>
                </Box>
                {/* Timestamp */}
                <Typography
                  variant="caption"
                  sx={{ color: 'text.disabled', mt: 0.5 }}>
                  {isUser ? '🙋 You' : '🤖 AI'} · {timestamps[m.id] ?? ''}
                </Typography>
              </Box>
            );
          })}

          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
              }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: '18px 18px 18px 4px',
                  bgcolor: 'white',
                  boxShadow: 1,
                }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ⏳ Thinking...
                </Typography>
              </Box>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>

        {/* Input form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', gap: 1 }}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything — e.g. What cloud certifications does Hiroko have?"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
