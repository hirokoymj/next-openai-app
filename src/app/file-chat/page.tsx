'use client';

import { Grid, Container } from '@mui/material';
import { Chat } from './Chat';
import { FileUpload } from './FileUpload';
import { useBase64Image } from './useBase64Image';
import { AiModelHeader } from '@/components/AiModelHeader';

const FileChatPage = () => {
  const { fileData, fileError, handleUpload, resetFile } = useBase64Image();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12 }}>
          <FileChatPageHeader />
        </Grid>

        <Grid size={{ xs: 8 }}>
          {fileData ? (
            <Chat file={fileData} onClear={resetFile} />
          ) : (
            <FileUpload handleUpload={handleUpload} fileError={fileError} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default FileChatPage;

const FileChatPageHeader = () => {
  const headerInfo = {
    title: 'AI File Chat by Gemini',
    provider: 'Google',
    model: 'Gemini 2.5 Flash-Lite',
    repoUrl:
      'https://github.com/hirokoymj/next-openai-app/tree/main/src/app/file-chat',
    referenceUrl:
      'https://ai.google.dev/gemini-api/docs/text-generation#multi-turn-conversations',
    referenceLabel: 'Multimodal (text + image)',
    langSmithUrl:
      'https://github.com/hirokoymj/next-openai-app/tree/file-chat-langsmith/src/app/file-chat#langsmith-multimodal-evaluation-workflow',
    stack: [
      'Next.js (App Router)',
      'Server Actions',
      'Gemini API(chat.create)',
      'React useActionState',
      'Custom Hook',
    ],
  };
  return <AiModelHeader headerInfo={headerInfo} />;
};
