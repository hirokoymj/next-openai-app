# File Search by Gemini API (RAG)

**Summary (final)**

```js
File → Embeddings → Store a File Store → Semantic Search → Gemini Response

await ai.fileSearchStores.create({}) -> fileSearchStore
await ai.fileSearchStores.uploadToFileSearchStore({}) -> operation
await ai.models.generateContent({ config: [tools: fileSearch:"xxx"] }) -> response
```

<hr />

### My Tech notes

**Flow:**

File → Embeddings → Store a File Store → Semantic Search → Gemini Response

**Gemni File Search**

1. Create a File Search store – container for embeddings.
2. Upload & import a file – chunk, convert to embeddings, and index. Temporary file object lasts 48h; store data persists.
3. Query – use FileSearchRetrievalResource in a `generateContent` call to perform semantic search on the store.

**Flow details**:

1. Original File → broken into chunks → converted into embeddings → stored in File Search store.
2. User Query → converted to embedding → semantic search in File Search store → relevant chunks retrieved.
3. The model uses retrieved content to generate grounded answers.

| Step | Description                                                          | Keywords                                    |
| ---- | -------------------------------------------------------------------- | ------------------------------------------- |
| 1    | Create a File Search store to hold embeddings                        | File Search store, embeddings               |
| 2    | Upload & import file; chunk and convert to embeddings                | upload, import, embeddings, chunking        |
| 3    | Query store using semantic search with `FileSearchRetrievalResource` | semantic search, retrieval, generateContent |

```js
const fileSearchStore = await ai.fileSearchStores.create({
  config: { displayName: 'your-fileSearchStore-name' },
});

let operation = await ai.fileSearchStores.uploadToFileSearchStore({
  file: 'file.txt',
  fileSearchStoreName: fileSearchStore.name,
  config: {
    displayName: 'file-name',
  },
});
while (!operation.done) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  operation = await ai.operations.get({ operation });
}

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Can you tell me about [insert question]',
  config: {
    tools: [
      {
        fileSearch: {
          fileSearchStoreNames: [fileSearchStore.name],
        },
      },
    ],
  },
});

console.log(response.text);
```

## References

- [Gemini RAG](https://blog.google/innovation-and-ai/technology/developers-tools/file-search-gemini-api/)
- [API Docs](https://ai.google.dev/gemini-api/docs/file-search)
- [uploadToFileSearchStore](https://ai.google.dev/api/file-search/file-search-stores#method:-media.uploadtofilesearchstore)
- [YouTube](https://www.youtube.com/watch?v=s4nEJRuz3dk&t=5s)
