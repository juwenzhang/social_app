import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface PostDescProps {
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  content?: string;
}

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

type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;

const PostDesc: React.FC<PostDescProps> = (props: PostDescProps) => {
  const {
    children,
    src = '/images/default.jpg',
    alt = 'Image Do Not Load',
    title = 'Image',
    content = 'Content',
  } = props;
  const [watermarkedSrc, setWatermarkedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const watermarkText = "juwenzhang";

  const fullImageUrl = useMemo(() => {
    return typeof window !== 'undefined' 
      ? new URL(src, window.location.origin).toString() 
      : src;
  }, [src]);

  const handleWorkerMessage = useCallback((event: MessageEvent<WorkerResponse>) => {
    if ('error' in event.data) {
      setError(new Error(event.data.error));
      setIsLoading(false);
    } else {
      const url = URL.createObjectURL(event.data.data);
      setWatermarkedSrc(url);
      setIsLoading(false);
    }
  }, []);

  const handleWorkerError = useCallback((errorEvent: ErrorEvent) => {
    setError(new Error(`Web Worker 出错: ${errorEvent.message}`));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const worker = new Worker(
      new URL('../webworkers/imageProcessing.worker.ts', import.meta.url),
    );

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    const message: WorkerMessage = { src: fullImageUrl, watermarkText };
    worker.postMessage(message);

    return () => {
      isMounted = false;
      worker.terminate();
      if (watermarkedSrc) {
        URL.revokeObjectURL(watermarkedSrc);
      }
    };
  }, [fullImageUrl, watermarkText, handleWorkerMessage, handleWorkerError]);

  if (error) {
    return <div>加载图片时出错: {error.message}</div>;
  }

  return (
    <React.Fragment>
      <div className='flex flex-col gap-2 mt-2'>
        <div className='w-full min-h-96 relative'>
          {isLoading ? (
            <div className="loading-container-local">
              <div className="loading-spinner-local"></div>
              <p className="loading-text-local">Loading……</p>
            </div>
          ) : (
            <a
              href={watermarkedSrc || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='block w-full h-full rounded-lg overflow-hidden'
            >
              <Image
                src={watermarkedSrc || src}
                alt={alt}
                fill
                loading='lazy'
                className='w-full h-full object-cover rounded-lg shadow-md'
              />
            </a>
          )}
        </div>
        <p className='p-2'>
          {content}
          {children}
        </p>
      </div>
    </React.Fragment>
  );
};

export default PostDesc;