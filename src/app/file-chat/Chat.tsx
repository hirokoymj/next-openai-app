'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, CircularProgress } from '@mui/material';

interface Message {
  role: 'user' | 'model' | 'info';
  parts: { text: string }[];
}

export const Chat = ({ file }: { file: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'info',
      parts: [{ text: '✅ Image uploaded. You can start asking questions!' }],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'user',
      parts: [{ text: input }],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const serverHistory = messages.filter(
      (m) => m.role === 'user' || m.role === 'model'
    );

    try {
      const res = await fetch('/api/file-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          file,
          history: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: file.type,
                    data: file.base64,
                  },
                },
              ],
            },
            ...serverHistory,
          ],
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: data.text }] },
      ]);
    } catch (err) {
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {file.imageUrl && (
        <Box mb={2} display="flex" justifyContent="center">
          <img src={file.imageUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </Box>
      )}

      <Paper sx={{ height: 200, overflowY: 'auto', p: 2, mb: 2 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role === 'user' ? 'You:' : 'Gemini:'}</strong>{' '}
            {msg.parts[0].text}
          </div>
        ))}

        {loading && <CircularProgress size={20} />}
        <div ref={messagesEndRef} />
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </Box>
    </Box>
  );
};
