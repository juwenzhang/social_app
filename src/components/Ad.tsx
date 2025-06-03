'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdProps{
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

interface WorkerMessage {
  src: string;
}

interface WorkResponse {
  data: Blob;
}

interface WorkerSuccessResponse {
  data: Blob;
}

interface WorkerErrorResponse {
  error: string;
}

type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;

const Ad: React.FC<AdProps>
= (props: AdProps) => {
  const {
    children,
    size = 'md',
    src = '/images/default.jpg'
  } = props;
  const [compressSrc, setCompressSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  let isMounted = true;

  const fullImageUrl = typeof window!== 'undefined'
    ? new URL(src, window.location.origin).toString()
    : src;

  useEffect(() => {
    const worker = new Worker(
      new URL('../webworkers/ImageCompress.worker.ts', import.meta.url),
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if ('error' in event.data) {
        if (isMounted) {
          setError(new Error(event.data.error));
          setIsLoading(false);
        }
      } else {
        const url = URL.createObjectURL(event.data.data);
        if (isMounted) {
          setCompressSrc(url);
          setIsLoading(false);
        }
      }
    }
    worker.onerror = (errorEvent) => {
      if (isMounted) {
        setError(new Error(`Web Worker 出错: ${errorEvent.message}`));
        setIsLoading(false);
      } 
    }

    const message: WorkerMessage = { src: fullImageUrl };
    worker.postMessage(message);

    return () => {
      isMounted = false;
      setIsLoading(false);
      setError(null);
      setCompressSrc(null);
      worker.terminate();
      if (compressSrc) {
        URL.revokeObjectURL(compressSrc);
      }
    }
  }, [])
  
  if (error) {
    return <div className='text-red/50'>
      加载图片时出错: {error.message}
    </div>;
  }

  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 
        shadow-md text-sm w-full'
      >
        {/* top */}
        <div className='flex justify-between items-center text-sm'>
          <span className='gradient-text font-semibold'>
            AD
          </span>
          <Image
            src='/images/more.png'
            width={24}
            height={24}
            alt='Image'
            loading='lazy'
            className='size-6 object-cover'
          />
        </div>
        {/* bottom */}
        <div 
          className={`
            flex flex-col mt-2 
            w-full relative
            ${ size ==='sm' 
              ? 'h-24' 
              : size ==='md' 
                ? 'h-36' 
                : 'h-48' 
            }
            ${size === 'sm' 
              ? 'gap-2' 
              : 'gap-4'
            }
          `}
        >
          {!isLoading ? 
            (<div>
              <Image
                src={compressSrc || '/images/default.jpg'}
                fill
                alt='Image'
                loading='lazy'
                className='object-cover rounded-lg'
              />
            </div>)  : (
              <div className="loading-container-local">
                <div className="loading-spinner-local"></div>
                <p className="loading-text-local">加载中……</p>
              </div>
            )
          }
        </div>
        <p className={`
          p-2 rounded-md bg-white/50 
          shadow-md text-sm w-full
          ${size === 'sm' ? "text-xs" : size ==='md'? "text-sm" : "text-base"}  
        `}>
          欢迎访问我的个人博客，这里是我的技术分享和生活记录。
          如果你有任何问题或建议，欢迎联系我。
          让我们一起探索技术的世界，分享知识和经验。
          欢迎来到我的博客！
        </p>
        <button
          className='p-2 rounded-md shadow-md text-sm w-full text-white
            bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg
            hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
            cursor-pointer transition-all duration-300 ease-in-out
        '>
          <Link href='/profile/dcadfasfaeg'>
            Learn More
          </Link>
        </button>
        {children}
      </div>
    </React.Fragment>
  )
}

export default Ad;