'use client';
import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression'; // Import the library

export interface UploadFile {
  mimeType: string;
  data: string;
  imageUrl: string;
}

export const useBase64Image = () => {
  const [fileData, setFileData] = useState<null | UploadFile>(null);
  const [fileError, setFileError] = useState<null | string>(null);

  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0];
      if (!uploadedFile) return;

      // 1. Initial size check for UI feedback
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large. Max limit is 4MB.`);
        setFileData(null);
        return;
      }

      setFileError(null);

      try {
        // 2. Compression Options
        // const options = {
        //   maxSizeMB: 0.5,
        //   maxWidthOrHeight: 1024,
        //   useWebWorker: true,
        //   fileType: 'image/jpeg',
        // };
        // const options = {
        //   maxSizeMB: 0.1, // Drop to 100KB - This is plenty for Diamond Head
        //   maxWidthOrHeight: 768, // 768px is the magic number for the 'Low-Res' bucket
        //   useWebWorker: true,
        //   fileType: 'image/jpeg',
        //   initialQuality: 0.7, // Lower quality helps trigger the lower billing tier
        // };

        const options = {
          maxSizeMB: 0.05, // 50KB - very small
          maxWidthOrHeight: 512, // Try 512 to force the "Single Tile" bucket
          useWebWorker: true,
          fileType: 'image/jpeg',
        };

        // 3. Compress the image
        const compressedFile = await imageCompression(uploadedFile, options);

        // 4. Convert the compressed Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          const base64String = reader.result as string;

          setFileData({
            mimeType: 'image/jpeg',
            data: base64String.split(',')[1], // Strip the prefix for Native SDK
            imageUrl: URL.createObjectURL(compressedFile), // Show the compressed preview
          });
        };
      } catch (error) {
        console.error('Compression Error:', error);
        setFileError('Failed to process image.');
      }
    },
    [],
  );

  const resetFile = useCallback(() => {
    setFileData(null);
    setFileError(null);
  }, []);

  return { fileData, fileError, handleUpload, resetFile };
};
