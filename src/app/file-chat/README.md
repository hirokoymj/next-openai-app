# File Chat by Gemini

### Tech Stack & Architectures

**Backend**

- **Next.js 16** (App Router)
- **Server Actions**: Leveraging `useActionState` for seamless Client-Server communication.
- **Gemini API (Gemini 2.5 Flash-Lite)**: Utilizing `chats.create` for session management and `chat.sendMessage` for multi-modal turns.
- **Zod**: Server-side form validation.
- **LangSmith**: Tracing and observability for AI runs.

**Frontend**

- **React useActionState**: Manages UI state, loading indicators, and server responses.
- **Custom Hook (`useBase64Image`)**: Handles client-side file validation (4MB limit), Base64 encoding, and memory management via `URL.revokeObjectURL`.
- **Material UI (MUI)**: UI components with responsive design.

---

### Project Structure

```js

src/app/file-chat/
├── actions.ts 			# Server Actions: Gemini SDK logic & Chat history management
├── Chat.tsx 			# Client Component: The main chat interface & message rendering
├── FileUpload.tsx 		# Client Component: Upload a file
├── page.tsx 			# Server Component: Feature entry point
└── useBase64Image.ts   # Custom Hook: Base64 conversion & memory cleanup
```

### The Input (Payload)

- **Message**: The user's text prompt.
- **History**: The previous messages.
- **Image**: The uploaded image by a user. The Base64 data (only included on the first message to save bandwidth).

```js
const [state, formAction, isPending] = useActionState<ChatState, FormData>(submitPrompt);
```

### The Output (Response State)

The Server Action returns a ChatState object that React uses to update the UI:

- **success**: Boolean toggle to reset the form or show errors.
- **text**: The latest string response from Gemini.
- **updatedHistory**: The new conversation array (including the AI's response).
- **error**: A string message if something goes wrong (e.g., "API Key missing").

```js
type ChatState = {
  success: boolean;
  text?: string;
  updatedHistory: any[];
  error?: string;
};
```

### Screenshot

![](../../../public/screenshots/gemini-file-chat.png)

### LangSmith: Multimodal Evaluation Workflow

1. **Dataset**: Create examples and upload file attachments.
2. **Playground**: Use {AllAttachments} in the Human prompt.
3. **Results**: Run experiments to view outputs.
4. **Commit**: Save the prompt with the tag filechat-prompt:prod.
5. **Code**: Update your app to pull from the LangChain Hub.

<img src="../../../public/screenshots/langsmith-tracing-multi-compare.png" alt="description" style="border: 2px solid #000; padding: 5px;">

<img src="../../../public/screenshots/langsmith-dataset-multimodal.png" alt="description" style="border: 2px solid #000; padding: 5px;">

### References

- [Gemini API: Multi-turn conversations](https://ai.google.dev/gemini-api/docs/text-generation#multi-turn-conversations)
- [@google/genai: sendMessage](https://googleapis.github.io/js-genai/release_docs/classes/chats.Chat.html#sendmessage)
- [@google/genai: Chat Creation](https://googleapis.github.io/js-genai/release_docs/classes/chats.Chats.html#create)
- [LangSmith YouTube: multimodal](https://www.youtube.com/watch?v=-VOnEpk3uWo&t=7s)
- [LangSmith: Include multimodal content in a prompt](https://docs.langchain.com/langsmith/multimodal-content#include-multimodal-content-in-a-prompt)
- [LangSmith: Strucreud output](https://docs.langchain.com/langsmith/create-a-prompt#structured-output)
- [LangSmith: multimodal content in prompt](https://docs.langchain.com/langsmith/multimodal-content)
- [LangSmith: Manage prompts programmatically](https://docs.langchain.com/langsmith/manage-prompts-programmatically)
