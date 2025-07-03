import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';
import cloudinary from '@/libs/cloudinary';

const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp/uploads');
const pipeline = promisify(stream.pipeline);

export async function POST(request: Request) {
  try {
    const { fileId, fileName, folder } = await request.json();

    if (!fileId || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing fileId or fileName' },
        { status: 400 }
      );
    }

    const fileDir = path.join(TEMP_UPLOAD_DIR, fileId);
    const progressFilePath = path.join(fileDir, '.progress');

    if (!fs.existsSync(fileDir)) {
      return NextResponse.json(
        { success: false, error: 'File chunks not found' },
        { status: 404 }
      );
    }

    const chunkFiles = fs.readdirSync(fileDir)
      .filter(file => file.startsWith('chunk-'))
      .sort((a, b) => {
        const indexA = parseInt(a.split('-')[1]);
        const indexB = parseInt(b.split('-')[1]);
        return indexA - indexB;
      });

    if (chunkFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No chunks found for this file' },
        { status: 404 }
      );
    }

    const mergedFilePath = path.join(TEMP_UPLOAD_DIR, `${fileId}-${fileName}`);

    const writeStream = fs.createWriteStream(mergedFilePath);

    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(fileDir, chunkFile);
      const readStream = fs.createReadStream(chunkPath);
      await pipeline(readStream, writeStream);
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'uploads',
          public_id: fileId,
          resource_type: fileName.toLowerCase().includes('.mp4') ||
          fileName.toLowerCase().includes('.mov') ? 'video' : 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const fileStream = fs.createReadStream(mergedFilePath);
      fileStream.pipe(stream);

      fileStream.on('error', (err) => {
        reject(err);
      });
    });

    fs.unlinkSync(mergedFilePath);
    if (fs.existsSync(progressFilePath)) {
      fs.unlinkSync(progressFilePath);
    }
    fs.rmdirSync(fileDir);

    return NextResponse.json({
      success: true,
      message: 'File uploaded and merged successfully',
      url: (cloudinaryResponse as any).secure_url,
      fileId,
      fileName
    });
  } catch (error) {
    console.error('Error completing upload:', error);

    try {
      const { fileId } = await request.json();
      if (fileId) {
        const fileDir = path.join(TEMP_UPLOAD_DIR, fileId);
        if (fs.existsSync(fileDir)) {
          fs.rmSync(fileDir, { recursive: true, force: true });
        }
      }
    } catch (cleanupError) {
      console.error('Error cleaning up:', cleanupError);
    }

    return NextResponse.json(
      { success: false, error: 'Failed to complete upload', details: error.message },
      { status: 500 }
    );
  }
}