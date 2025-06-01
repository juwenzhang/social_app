import React from 'react';
import Image from 'next/image';
import StoryItem from './StoryItem';

interface StoriesProps{
  children?: React.ReactNode;
}

const Stories: React.FC<StoriesProps>
= (props: StoriesProps) => {
  const {children} = props;
  const stories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return(
    <React.Fragment>
      <div 
        className='p-4 bg-white/50 rounded-lg shadow-md 
          overflow-scroll text-sm scrollbar-hide text-xs'
      >
        <div className='flex gap-8'>
          {stories.map((_, index) => (
            <StoryItem key={index} />
          ))}
        </div>
        {children}
      </div>
    </React.Fragment>
  )
}

export default Stories;