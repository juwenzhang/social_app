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

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { src, watermarkText } = event.data;
  
  try {
    console.log('[Worker] 开始处理图片:', src);
    const processor = await ImageProcessor.fromUrl(src);
    const compressedData = await processor.compress({
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
      format: 'webp'
    });
    const compressedProcessor = new ImageProcessor(compressedData);
    const watermarkedData = await compressedProcessor.addTextWatermark(
      watermarkText,
      '24px Arial',
      'rgba(255, 255, 255, 0.5)',
      'bottom-right'
    );
    
    self.postMessage({ data: watermarkedData } as WorkerSuccessResponse);
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