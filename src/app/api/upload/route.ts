import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp/uploads');

if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const fileId = formData.get('fileId') as string;
    const chunkIndex = formData.get('chunkIndex') as string;
    const fileName = formData.get('fileName') as string;
    const totalChunks = parseInt(formData.get('totalChunks') as string);

    if (!chunk || !fileId || !chunkIndex || !fileName || isNaN(totalChunks)) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const fileDir = path.join(TEMP_UPLOAD_DIR, fileId);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    const chunkPath = path.join(fileDir, `chunk-${chunkIndex}`);

    const stream = fs.createWriteStream(chunkPath);
    await new Promise((resolve, reject) => {
      const fileStream = chunk.stream();
      const reader = fileStream.getReader();

      const processChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          stream.end();
          resolve(true);
          return;
        }

        stream.write(Buffer.from(value));
        processChunk();
      };

      stream.on('error', (err) => {
        reader.cancel();
        reject(err);
      });

      processChunk();
    });

    const progressFilePath = path.join(fileDir, '.progress');
    fs.appendFileSync(progressFilePath, `${chunkIndex}\n`);

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex} of ${fileName} uploaded successfully`,
      fileId,
      chunkIndex,
      totalChunks
    });
  } catch (error) {
    console.error('Error uploading chunk:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload chunk', details: error.message },
      { status: 500 }
    );
  }
}