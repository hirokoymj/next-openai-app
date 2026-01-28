'use client';
import { useState, useCallback } from 'react';

export interface UploadFile {
  mimeType: string;
  data: string;
  imageUrl: string;
}

export const useBase64Image = () => {
  const [fileData, setFileData] = useState<null | UploadFile>(null);
  const [fileError, setFileError] = useState<null | string>(null);

  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

  const convertFileToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = useCallback(async (event: any) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `File is too large (${(uploadedFile.size / 1024 / 1024).toFixed(1)}MB). Max limit is 4MB.`,
      );
      setFileData(null);
      return;
    }

    setFileError(null);

    const base64String = (await convertFileToBase64(uploadedFile)) as string;

    setFileData({
      mimeType: uploadedFile.type,
      data: base64String.split(',')[1], //Gemini needs pure Base64 bytes (data:image/jpeg;base64,/9j/4AAQS... -> /9j/4AAQS...)
      imageUrl: uploadedFile.type.startsWith('image/')
        ? URL.createObjectURL(uploadedFile)
        : '/document-icon.png',
    });
  }, []);

  const resetFile = useCallback(() => {
    setFileData(null);
    setFileError(null);
  }, []);

  return { fileData, fileError, handleUpload, resetFile };
};
