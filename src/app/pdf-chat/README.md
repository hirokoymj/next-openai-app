# Chat with a PDF

The chunking function is the core new thing — everything else is patterns you already know from the resume app.

Want me to start building it? I'd suggest starting with the upload route since chunking is the new concept to nail first.

```text
/api/upload-pdf   → parse → chunk → embed → upsert to Pinecone
/api/pdf-chat     → embed question → query Pinecone → stream answer
/pdf-chat         → upload UI + chat UI
```

## New concepts you'll learn (vs your resume app):

1. Chunking — the most important RAG skill

Full PDF text
→ split by paragraphs (double newline)
→ if chunk > 1000 chars, split further
→ overlap ~100 chars between chunks (so context isn't lost at boundaries)

2. Pinecone namespaces — isolate each uploaded PDF

`pinecone.index('resume-index').namespace(documentId)`

- Each PDF gets its own namespace, so queries don't mix results across documents.

3. Conversational memory — pass prior Q&A as context

// Include last N messages in the system prompt so follow-up questions work

## Learning Path

- Finish the PDF chat app (TypeScript) — understand chunking deeply
- Phase 2: Rebuild in Python + LangChain + FastAPI
- Add LangSmith tracing to Phase 2 (you already know it)
