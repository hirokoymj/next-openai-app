'use client';

import { useActionState, useRef, useEffect } from 'react';
import { submitPrompt, type ChatState } from './actions';
import { type UploadFile } from './useBase64Image'; // Import the type
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';

interface ChatProps {
  file: UploadFile;
  onClear: () => void;
}

export function Chat({ file, onClear }: ChatProps) {
  const [state, formAction, isPending] = useActionState<ChatState, FormData>(
    submitPrompt,
    {
      updatedHistory: [],
      success: false,
    },
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper
        variant="outlined"
        sx={{ p: 2, height: 450, overflowY: 'auto', mb: 2 }}>
        {/* IMAGE PREVIEW WITH CLEAR BUTTON */}
        {file.imageUrl && (
          <Box
            mb={2}
            sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
            <img
              src={file.imageUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '250px',
              }}
            />
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={onClear}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                textTransform: 'none',
                boxShadow: 3,
              }}>
              Clear Image
            </Button>
          </Box>
        )}

        {(state.updatedHistory ?? []).map((msg: any, idx: number) => (
          <Box
            key={idx}
            sx={{ textAlign: msg.role === 'user' ? 'right' : 'left', mb: 2 }}>
            <Typography variant="caption" color="textSecondary">
              {msg.role === 'user' ? 'You' : 'Gemini'}
            </Typography>
            <Typography
              sx={{
                bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                p: 1,
                borderRadius: 1,
              }}>
              {msg.parts[0].text}
            </Typography>
          </Box>
        ))}
        {isPending && <CircularProgress size={20} sx={{ mt: 1 }} />}
      </Paper>

      <form action={formAction} ref={formRef}>
        <input
          type="hidden"
          name="history"
          value={JSON.stringify(state.updatedHistory ?? [])}
        />

        {/* If state.success is true, we don't need to send the base64 string again! */}
        {!state.success && (
          <input
            type="hidden"
            name="image"
            value={JSON.stringify({ mimeType: file.mimeType, data: file.data })}
          />
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            name="message"
            placeholder="Ask about the image..."
            disabled={isPending}
          />
          <Button type="submit" variant="contained" disabled={isPending}>
            Send
          </Button>
        </Box>
      </form>
    </Box>
  );
}
