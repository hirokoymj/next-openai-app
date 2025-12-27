import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      message,
      history = [],
      image, // { mimeType, data }
    } = body;

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
                {
                  inlineData: {
                    mimeType: image.mimeType,
                    data: image.data,
                  },
                },
              ],
            },
            ...history,
          ]
        : history,
    });

    const response = await chat.sendMessage({
      message,
    });

    return NextResponse.json({
      text: response.text,
      updatedHistory: [
        ...history,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: response.text }] },
      ],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
