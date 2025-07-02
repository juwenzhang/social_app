import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/libs/cloudinary';

const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp/uploads');

export async function POST(request: Request) {
  try {
    const { fileId, fileName, folder } = await request.json();
    const fileDir = path.join(TEMP_UPLOAD_DIR, fileId);

    if (!fs.existsSync(fileDir)) {
      return NextResponse.json(
        { success: false, error: 'File chunks not found' },
        { status: 404 }
      );
    }

    const chunkFiles = fs.readdirSync(fileDir)
      .filter(file => file.startsWith('chunk-'))
      .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

    if (chunkFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No chunks found' },
        { status: 400 }
      );
    }

    const combinedFilePath = path.join(TEMP_UPLOAD_DIR, `${fileId}-${fileName}`);
    const writeStream = fs.createWriteStream(combinedFilePath);

    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(fileDir, chunkFile);
      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);
      fs.unlinkSync(chunkPath); 
    }

    writeStream.end();

    const uploadResult = await new Promise((resolve, reject) => {
      writeStream.on('finish', async () => {
        try {
          const stream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder,
            format: fileName.split('.').pop() || 'webp',
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });

          fs.createReadStream(combinedFilePath).pipe(stream);
        } catch (error) {
          reject(error);
        } finally {
          fs.unlinkSync(combinedFilePath);
          fs.rmdirSync(fileDir);
        }
      });

      writeStream.on('error', reject);
    });

    return NextResponse.json({
      success: true,
      data: uploadResult
    });
  } catch (error) {
    console.error('Error completing upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete upload' },
      { status: 500 }
    );
  }
}