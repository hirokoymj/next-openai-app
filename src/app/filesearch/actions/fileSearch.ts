'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

let fileSearchStoreName: string | null = null;

export async function createFileSearchStore() {
  try {
    if (!fileSearchStoreName) {
      const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'rag-file-store' },
      });
      fileSearchStoreName = fileSearchStore.name || null;
    }
    return { success: true, storeName: fileSearchStoreName };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (!fileSearchStoreName) {
      const storeResult = await createFileSearchStore();
      if (!storeResult.success || !storeResult.storeName) {
        return {
          success: false,
          error: storeResult.error || 'Failed to create file store',
        };
      }
      fileSearchStoreName = storeResult.storeName;
    }

    const operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: file as Blob,
      fileSearchStoreName: fileSearchStoreName!,
      config: {
        displayName: file.name,
      },
    });

    // Wait until import is complete
    let currentOperation = operation;
    while (!currentOperation.done) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      currentOperation = await ai.operations.get({
        operation: currentOperation,
      });
    }

    return {
      success: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function askQuestion(question: string) {
  try {
    if (!fileSearchStoreName) {
      return {
        success: false,
        error: 'No file store found. Please upload a file first.',
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [fileSearchStoreName],
            },
          },
        ],
      },
    });

    return { success: true, answer: response.text };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
