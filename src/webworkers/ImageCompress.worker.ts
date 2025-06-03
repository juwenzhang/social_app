import ImageProcessor from '@/utils/ImageProcessor';
import { isError } from '@/utils/FPUtil';

interface WorkerMessage {
  src: string; 
  watermarkText: string;
}

interface WorkerSuccessResponse {
  data: Blob;
}

interface WorkerErrorResponse {
  error: string;
}

// save processed images and their results
// const processedImages = new Map<string, Blob>();

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { src } = event.data;

  try {
    const processor = await ImageProcessor.fromUrl(src);
    const compressedData = await processor.compress({
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
      format: 'webp'
    });

    // processedImages.set(src, compressedData);
    self.postMessage({ data: compressedData } as WorkerSuccessResponse);
  } catch (err) {
    console.error('[Worker] 处理失败:', err);
    let errorMessage = '未知错误';
    if (isError(err) 
      && typeof err === 'object' 
      && err !== null 
      && 'message' in err
    ) {
      errorMessage = err.message as string || '错误信息不可用';
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.toString();
    }
    self.postMessage({ error: errorMessage } as WorkerErrorResponse);
  }
};