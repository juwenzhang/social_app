"use client";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

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

const useWatermarkImage = (
  src: string, 
  watermarkText: string
) => {
  const [watermarkedSrc, setWatermarkedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const isMounted = useRef(true);
  const MAX_RETRIES = 3;
  const pathname = usePathname();

  const fullImageUrl = typeof window !== 'undefined' 
    ? new URL(src, window.location.origin).toString() 
    : src;

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../webworkers/imageProcessing.worker.ts', import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if ('error' in event.data) {
        if (isMounted.current) {
          if (retryCount < MAX_RETRIES) {
            setRetryCount(retryCount + 1);
          } else {
            setError(new Error(event.data.error));
            setIsLoading(false);
          }
        }
      } else {
        const url = URL.createObjectURL(event.data.data);
        if (isMounted.current) {
          setWatermarkedSrc(url);
          setIsLoading(false);
        }
      }
    };

    workerRef.current.onerror = (errorEvent) => {
      if (isMounted.current) {
        setError(new Error(`Web Worker 出错: ${errorEvent.message}`));
        setIsLoading(false);
      }
    };

    const message: WorkerMessage = { src: fullImageUrl, watermarkText };
    workerRef.current.postMessage(message);

    return () => {
      isMounted.current = false;
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (watermarkedSrc) {
        URL.revokeObjectURL(watermarkedSrc);
      }
    };
  }, [pathname, fullImageUrl, watermarkText]);

  return { watermarkedSrc, isLoading, error };
};

export default useWatermarkImage;