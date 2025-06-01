"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageProcessor from '@/utils/ImageProcessor';

interface PostDescProps{
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  content?: string;
}

function textToImage(watermarkText: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('无法获取 canvas 上下文'));
      return;
    }

    ctx.font = '24px Arial'; 
    const textMetrics = ctx.measureText(watermarkText);
    canvas.width = textMetrics.width + 100;
    canvas.height = 100;

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'; 
    ctx.fillText(watermarkText, 10, 50);

    canvas.toBlob((blob) => {
      if (blob) {
        const watermarkImage = new File(
          [blob], 
          'watermark.png', 
          { type: 'image/png' }
        );
        resolve(watermarkImage);
      } else {
        reject(new Error('无法生成水印图片'));
      }
    });
  });
}

const PostDesc: React.FC<PostDescProps>
= (props: PostDescProps) => {
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

  useEffect(() => {
    let isMounted = true;
    const processImageWithWatermark = async () => {
      try {
        const watermarkImage = await textToImage(watermarkText);
        const processor = await ImageProcessor.fromUrl(src);
        const watermarkedData = await processor.addImageWatermark(
          watermarkImage,
          'bottom-right',
          1
        );
        const url = URL.createObjectURL(watermarkedData);
        if (isMounted) {
          setWatermarkedSrc(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    processImageWithWatermark();

    return () => {
      isMounted = false;
      if (watermarkedSrc) {
        URL.revokeObjectURL(watermarkedSrc);
      }
    };
  }, [src, watermarkText]);

  if (error) {
    return <div>加载图片时出错: {error.message}</div>;
  }

  return(
    <React.Fragment>
      <div className='flex flex-col gap-2 mt-2'>
        <div className='w-full min-h-96 relative'>
          {isLoading ? (
            <div className="loading-container-local">
              <div className="loading-spinner-local"></div>
              <p className="loading-text-local">加载中……</p>
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
                className='w-full h-full object-cover rounded-lg' 
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
  )
}

export default PostDesc;