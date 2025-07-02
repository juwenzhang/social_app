import { v4 as uuidv4 } from 'uuid';

export async function UploadSingleLargeFileToServer(file: File, folder: string) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = uuidv4(); // Generate unique file ID

  // Upload chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('fileId', fileId);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file.name);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload chunk ${i}: ${await response.text()}`);
    }
  }

  // Notify server to complete upload
  const completeResponse = await fetch('/api/upload/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId, fileName: file.name, folder }),
  });

  if (!completeResponse.ok) {
    throw new Error(`Failed to complete upload: ${await completeResponse.text()}`);
  }

  return completeResponse.json();
}