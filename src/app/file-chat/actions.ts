'use server';

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

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

export async function submitPrompt(
  prevState: ChatState,
  formData: FormData,
): Promise<ChatState> {
  try {
    // 1. INITIALIZE Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Server configuration error: API Key is missing.');
    }
    const ai = new GoogleGenAI({ apiKey });

    // 2. Get form data and validate the fields.
    const validated = ChatSchema.parse({
      message: formData.get('message'),
      history: JSON.parse((formData.get('history') as string) || '[]'),
      image: formData.get('image')
        ? JSON.parse(formData.get('image') as string)
        : undefined,
    });
    const { message, history, image } = validated;

    //3. Create chat
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

    // 3. Send the message
    const response = await chat.sendMessage({ message });
    // 4. response to the client
    return {
      success: true,
      text: response.text,
      updatedHistory: [
        ...history.map((item) => {
          if (item.parts?.[0]?.inlineData) {
            return { ...item, parts: [{ text: '[Image Analyzed]' }] };
          }
          return item;
        }),
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: response.text }] },
      ],
    };
  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return {
      success: false,
      error: 'The AI service encountered an issue.',
      updatedHistory: prevState.updatedHistory, // Return existing history so the UI doesn't break
    };
  }
}
