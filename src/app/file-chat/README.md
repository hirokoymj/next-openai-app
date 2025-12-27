# App Overview

**AI: Chat with File** is a Next.js application that allows users to upload a file (image) and have a multi-turn conversation with Google **Gemini 2.5 Flash-Lite** about that file.
The application uses **Next.js App Router** to separate frontend UI logic from backend AI execution for security, scalability, and maintainability.

## Tech Stack Summary

**Frontend**

- Next.js (App Router)
- React Client Components
- Custom Hooks (file → Base64 conversion)
- Chat history state

**Backend**

- Next.js App Route (route.ts)
- POST API
- Google Gemini SDK (@google/genai)

**AI**

- Provider: Google
- Model: Gemini 2.5 Flash-Lite
- Mode: Multi-turn conversation with system instructions

<hr />

### POST Request to Backend

`POST /api/file-chat`

**Payload**

```js
{
  message: string,
  history: ChatHistory[],
  image?: {
    mimeType: string,
    data: base64
  }
}
```

**Chat Session Reconstruction**

```js
export async function POST(req: NextRequest) {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      config: {
        systemInstruction:
          'You are a chatbot that answers questions about an uploaded image.',
      },
      history,
    });
  } catch (error) {}
}
```
