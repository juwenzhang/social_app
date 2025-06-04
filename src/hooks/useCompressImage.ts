"use client"
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface WorkerMessage {
  src: string;
}

interface WorkerSuccessResponse {
  data: Blob;
}

interface WorkerErrorResponse {
  error: string;
}

type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;

const useCompressImage = (
  src: string,
) => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const isMounted = useRef(true);
  const MAX_RETRIES = 3;
  const pathname = usePathname();

  const fullImageUrl = typeof window!== 'undefined'
    ? new URL(src, window.location.origin).toString()
    : src;

  useEffect(() => {
    workerRef.current = new Worker(new URL(
      '../webworkers/ImageCompress.worker.ts', 
      import.meta.url));

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
          setResult(url);
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

    workerRef.current.postMessage({ src: fullImageUrl });

    return () => {
      isMounted.current = false;
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (result) {
        URL.revokeObjectURL(result);
      }
    };
  }, [fullImageUrl]);

  return { result, isLoading, error };
};

export default useCompressImage;