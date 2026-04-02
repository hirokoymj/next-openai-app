'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

let globalStoreName: string | undefined;

async function getOrCreateStore() {
  if (globalStoreName) return globalStoreName;

  const store = await ai.fileSearchStores.create({
    config: { displayName: 'rag-file-store' },
  });

  globalStoreName = store.name;
  return globalStoreName;
}

export async function uploadFileAction(prevState: any, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { error: 'No file provided' };

    const storeName = await getOrCreateStore();

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: file as Blob,
      fileSearchStoreName: storeName!,
      config: { displayName: file.name },
    });

    // Clean polling logic
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      operation = await ai.operations.get({ operation });
    }

    return { message: 'File indexed and ready!', success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

// Add storeName as a parameter to the action
export async function askQuestionAction(
  prevState: any,
  formData: FormData,
  storeNameFromClient?: string, // Add this!
) {
  try {
    const question = formData.get('question') as string;
    const storeName = storeNameFromClient || globalStoreName; // Use the one passed from client

    if (!question) return { error: 'Please enter a question.' };
    if (!storeName)
      return { error: 'No document found. Please upload a file first.' };

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Use stable version
      contents: question,
      config: {
        tools: [
          {
            fileSearch: { fileSearchStoreNames: [storeName] },
          },
        ],
      },
    });

    return { answer: response.text, success: true, storeName }; // Return storeName to keep it alive
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}
