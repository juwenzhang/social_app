import React from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface StoryItemProps{
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}

const StoryItem: React.FC<StoryItemProps>
= (props: StoryItemProps) => {
  const {
    children, 
    src = '/images/default.jpg', 
    alt = 'Image Do Not Load', 
    width = 100, 
    height = 100, 
    title = 'Image', 
    className
  } = props;

  return(
    <React.Fragment>
      <div className={
        twMerge(
          `flex flex-col items-center justify-center 
           gap-2 cursor-pointer`, 
          className
        )
      }>
        <div className='w-15 h-15 rounded-full ring-2 
          ring-gray-300 overflow-hidden'>
          <Image 
            src={src} 
            alt={alt}  
            width={width}
            height={height}
            className='object-cover'
          />
        </div>
        <span className='font-semibold gradient-text'>
          {title}
        </span>
        {children}
      </div>
    </React.Fragment>
  )
}

export default StoryItem;