'use server';

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { traceable } from 'langsmith/traceable';
import * as hub from 'langchain/hub';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  history: z.array(z.any()).default([]),
  image: z
    .object({
      mimeType: z.string(),
      data: z.string(),
    })
    .optional(),
});

export type ChatState = {
  success: boolean;
  text?: string;
  updatedHistory: any[];
  error?: string;
};

type ChatInput = {
  message: string;
  history: any[];
  image?: {
    mimeType: string;
    data: string;
  };
};

interface FileChatResponse {
  text: string;
  usage_metadata: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
const ENV = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';

const runGeminiChat = traceable(
  async ({ message, history, image }: ChatInput): Promise<FileChatResponse> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API Key missing');

    // 1. Pull Prompt from Hub (Native Mode - String Only)
    const promptTemplate = await hub.pull('filechat-prompt:prod');
    const systemInstruction = (promptTemplate as any).promptMessages[0].prompt
      .template;

    // 2. Initialize Native SDK
    const ai = new GoogleGenAI({ apiKey });

    // 3. Construct the 'contents' array (History + Current Message)
    const base64Data = image?.data.includes('base64,')
      ? image.data.split('base64,')[1]
      : image?.data;

    const contents = [
      ...history,
      {
        role: 'user',
        parts: [
          ...(image
            ? [{ inlineData: { mimeType: image.mimeType, data: base64Data } }]
            : []),
          { text: message },
        ],
      },
    ];

    // 4. Generate Content (New SDK Pattern)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return {
      text: response.text || '',
      usage_metadata: {
        prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        completion_tokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        total_tokens: response.usageMetadata?.totalTokenCount ?? 0,
      },
    };
  },
  {
    name: 'Gemini File Chat (Native Hub Version)',
    run_type: 'llm',
    metadata: { env: ENV, app: 'ai-file-chat' },
  },
);

export async function submitPrompt(
  prevState: ChatState,
  formData: FormData,
): Promise<ChatState> {
  try {
    // 1. Validate input
    const validated = ChatSchema.parse({
      message: formData.get('message'),
      history: JSON.parse((formData.get('history') as string) || '[]'),
      image: formData.get('image')
        ? JSON.parse(formData.get('image') as string)
        : undefined,
    });

    const { message, history, image } = validated;

    // 2. Call traced AI function
    const { text } = await runGeminiChat({
      message,
      history,
      image,
    });

    // 3. Build updated history for UI
    const updatedHistory = [
      ...history.map((item) => {
        if (item.parts?.[0]?.inlineData) {
          return { ...item, parts: [{ text: '[Image Analyzed]' }] };
        }
        return item;
      }),
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text }] },
    ];

    return {
      success: true,
      text,
      updatedHistory,
    };
  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return {
      success: false,
      error: 'The AI service encountered an issue.',
      updatedHistory: prevState.updatedHistory,
    };
  }
}

//====BEFORE LANGSMITH PROMPT MANAGEMENT
// const runGeminiChat = traceable(
//   async ({ message, history, image }: ChatInput): Promise<FileChatResponse> => {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error('Server configuration error: API Key is missing.');
//     }

//     const ai = new GoogleGenAI({ apiKey });

//     const chat = ai.chats.create({
//       model: 'gemini-2.5-flash-lite',
//       config: {
//         systemInstruction:
//           'You are a chatbot that answers questions about an uploaded image. Answer in short, text-only messages.',
//       },
//       history: image
//         ? [
//             {
//               role: 'user',
//               parts: [
//                 { inlineData: { mimeType: image.mimeType, data: image.data } },
//               ],
//             },
//             ...history,
//           ]
//         : history,
//     });

//     const response = await chat.sendMessage({ message });

//     if (!response.text) {
//       throw new Error('Empty response from Gemini');
//     }

//     //return response.text;
//     return {
//       text: response.text,
//       usage_metadata: {
//         prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
//         completion_tokens: response.usageMetadata?.candidatesTokenCount ?? 0,
//         total_tokens: response.usageMetadata?.totalTokenCount ?? 0,
//       },
//     };
//   },
//   {
//     name: 'Gemini File Chat',
//     run_type: 'llm',
//     metadata: { env: ENV, app: 'ai-file-chat' },
//   },
// );
//====BEFORE LANGSMITH PROMPT MANAGEMENT
