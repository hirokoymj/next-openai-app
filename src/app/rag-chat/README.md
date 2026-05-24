# AI Chatbot with Rag

## Techstack

- Framework : Next.js (App Router)
- AI SDK: [Vercel AI SDK](https://vercel.com/docs/ai-sdk)
- OpenAI: [text-embedding-3-small](https://developers.openai.com/api/docs/models/text-embedding-3-small)
- OpenAi: [GPT-4o-mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)
- Vector storage: [Pinecone](https://www.pinecone.io)

## Flow

PDF → chunks → embeddings → Pinecone (one-time ingest)
User question → embed → Pinecone search → GPT-4o-mini → streamed answer

## Structure

```bash
src/
├── app/
│ ├── api/
│ │ └── rag-chat/
│ │ └── route.ts ← RAG brain (embed → Pinecone → GPT-4o-mini)
│ └── rag-chat/
│ └── page.tsx ← Chat UI
└── scripts/
└── ingest.ts ← One-time PDF → Pinecone upload
```

## AI package

The `ai` package is the **Vercel AI SDK core** — it's the main engine that everything else builds on top of.

Think of it this way:

```
ai                    ← core engine (server-side utilities, types, transports)
├── @ai-sdk/react     ← React hooks that use the core (useChat, useCompletion)
├── @ai-sdk/openai    ← OpenAI provider (connects core to OpenAI's API)
└── @ai-sdk/anthropic ← Anthropic provider (connects core to Claude's API)
```

What `ai` provides in your app specifically:

| Import                    | What it does                                                               |
| ------------------------- | -------------------------------------------------------------------------- |
| `streamText`              | Calls the LLM and streams the response back (used in `route.ts`)           |
| `embed`                   | Converts text into a vector embedding (used in `ingest.ts` and `route.ts`) |
| `convertToModelMessages`  | Converts UI messages → LLM-compatible format (used in `route.ts`)          |
| `TextStreamChatTransport` | Tells `useChat` to expect plain text stream from the backend               |
| `isTextUIPart`            | Type guard to filter text parts out of a message's `parts` array           |

In short: **`@ai-sdk/react` is the frontend**, **`ai` is the backend + shared types**. You always need both when building a streaming chat app with the Vercel AI SDK.

## Cost

### GPT-4o mini

- https://developers.openai.com/api/docs/models/gpt-4o-mini
- Price: Input: $0.15, Output: $0.60

### OpenAI - text-embedding-3-small

- https://developers.openai.com/api/docs/models/text-embedding-3-small
- Embedings: Cost: $0.02
- The one-time ingest of your resume (~3,000 tokens) cost roughly $0.00006 — essentially free.
- This is why gpt-4o-mini + text-embedding-3-small is the recommended combo for portfolio projects.
