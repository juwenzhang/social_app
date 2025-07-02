import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '@/libs/cloudinary';

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

    const fileDir = path.join(TEMP_UPLOAD_DIR, fileId);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    const chunkPath = path.join(fileDir, `chunk-${chunkIndex}`);
    const arrayBuffer = await chunk.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(chunkPath, buffer);

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex} uploaded successfully`,
    });
  } catch (error) {
    console.error('Error uploading chunk:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload chunk' },
      { status: 500 }
    );
  }
}