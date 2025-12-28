'use client';

import { Grid, Container } from '@mui/material';
import { Chat } from './Chat';
import { FileUpload } from './FileUpload';
import { useBase64Image } from './useBase64Image';
import { AiModelHeader } from '@/components/AiModelHeader';

const headerInfo = {
  title: 'AI: Chat with File',
  provider: 'Google',
  model: 'Gemini 2.5 Flash-Lite',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/tree/main/src/app/file-chat',
  referenceUrl:
    'https://ai.google.dev/gemini-api/docs/text-generation#multi-turn-conversations',
  referenceLabel: 'Multimodal: text + image',
  stack: [
    'Backend (POST API, Gemini SDK), Frontend:(React Client Components, Base64, Chat history)',
  ],
};

const FileChatPage = () => {
  const { fileData, fileError, handleUpload } = useBase64Image();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12 }}>
          <AiModelHeader headerInfo={headerInfo} />
        </Grid>

        <Grid size={{ xs: 8 }}>
          {fileData ? (
            <Chat file={fileData} />
          ) : (
            <FileUpload handleUpload={handleUpload} fileError={fileError} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default FileChatPage;
