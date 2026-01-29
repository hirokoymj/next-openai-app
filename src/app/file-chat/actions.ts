'use server';

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { traceable } from 'langsmith/traceable';

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

const runGeminiChat = traceable(
  async ({ message, history, image }: ChatInput): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Server configuration error: API Key is missing.');
    }

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      config: {
        systemInstruction:
          'You are a chatbot that answers questions about an uploaded image. Answer in short, text-only messages.',
      },
      history: image
        ? [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: image.mimeType, data: image.data } },
              ],
            },
            ...history,
          ]
        : history,
    });

    const response = await chat.sendMessage({ message });

    if (!response.text) {
      throw new Error('Empty response from Gemini');
    }

    return response.text;
  },
  {
    name: 'Gemini File Chat',
    run_type: 'llm',
    tags: ['chat', 'image', 'gemini'],
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
    const text = await runGeminiChat({
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
