"use client";
import React, { useRef, useEffect, useState } from 'react';
import StoryItem from './StoryItem';

interface StoriesProps{
  children?: React.ReactNode;
}

interface StoryItemType {
  id: string;
  username: string;
  avatar: string;
  title: string;
}

const Stories: React.FC<StoriesProps>
= (props: StoriesProps) => {
  const {children} = props;
  const [stories, setStories] = useState<StoryItemType[]>([]);
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _requestFollows = await fetch(
          `/api/users`, 
          {
          method: 'GET',
          headers: {}
        });
        const data = await _requestFollows.json();
        console.log(data)
        if (data) {
          setStories(data || []);
        } else {
          setStories([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };
    fetchData();
  }, []);

  const handleScrollLeft = () => {
    if (storiesRef.current) {
      const { scrollLeft, clientWidth } = storiesRef.current;
      const newScrollLeft = Math.max(scrollLeft - clientWidth * 0.8, 0);
      storiesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  }

  const handleScrollRight = () => {
    if (storiesRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = storiesRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const newScrollLeft = Math.min(scrollLeft + clientWidth * 0.8, maxScroll);
      storiesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  }

  return(
    <React.Fragment>
      <div 
        className='p-4 bg-white/50 rounded-lg shadow-md h-30
          overflow-scroll text-sm scrollbar-hide relative max-w-full scroll-smooth
        '
        ref={storiesRef}
      >
        <div className='flex gap-8 flex-nowrap'>
          {stories.map((item) => (
            <StoryItem 
              key={item?.id} 
              src={item?.avatar}
              alt={item?.username}
              title={item?.username}
              userId={item?.id}
            />
          ))}
        </div>
        {children}
      </div>
      <div className='flex justify-between items-center relative'>
          <div className='
            absolute size-10 rounded-full left-[-20] bottom-5
            hover:bg-black/50 transition-all duration-300 cursor-pointer
            flex items-center justify-center
          ' onClick={handleScrollLeft}>
            <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
            </svg>
          </div>
          <div className='
            absolute size-10 rounded-full right-[-20] bottom-5 
            hover:bg-black/50 transition-all duration-300 cursor-pointer
            flex items-center justify-center
          ' onClick={handleScrollRight}>
            <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
            </svg>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Stories;