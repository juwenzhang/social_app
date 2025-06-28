import React from 'react';
import Image from 'next/image';
import { Image as ImageKit } from '@imagekit/next';
import Link from 'next/link';

interface AdProps{
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  userId: string;
}

const Ad: React.FC<AdProps> = (props: AdProps) => {
  const {
    children,
    size = 'md',
    userId
  } = props;

  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 
        shadow-md text-sm w-full flex flex-col gap-2'
      >
        {/* top */}
        <div className='flex justify-between items-center text-sm'>
          <span className='gradient-text font-semibold'>
            AD
          </span>
          <ImageKit
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
          <div>
            <ImageKit
              src={'/images/favicon.png'}
              fill
              alt='Image'
              loading='lazy'
              className='object-cover rounded-lg shadow-md'
            />
          </div>
        </div>
        {/* detail */}
        <div className={` 
          p-2 rounded-md bg-white/50 
          shadow-md text-sm w-full text-gray-500
          ${size === 'sm' ? "text-xs" : size ==='md'? "text-sm" : "text-base"}  
        `}>
          <strong>
            Welcome to JUWENZHANG Multi-User Social Platform! Share your thoughts, 
            connect with amazing people, and create memorable moments together!🌟💬✌❤
          </strong>
          <strong>
            <div>
              author: <span className='border-b-1'>JUWENZHANG</span>
            </div>
            <div>
              contact information in the GitHub: 
              &nbsp;<a 
                href='https://github.com/juwenzhang' 
                target='_blank' rel='noopener noreferrer'
                className='text-blue-500 border-b-1'>
                  juwenzhang
                </a>
            </div>
            <div>
              You Can Follow Me, Will Get Some New Friends!
            </div>
          </strong>
        </div>
        {/* button */}
        <button
          className='p-2 rounded-md shadow-md text-sm w-full text-white
            bg-gradient-to-r from-pink-500 to-orange-400
            hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
            cursor-pointer transition-all duration-300 ease-in-out
            font-semibold
        '>
          <Link 
            href="https://github.com/juwenzhang"
            target='_blank' rel='noopener noreferrer'
          >
            Learn More About Author
          </Link>
        </button>
        {children}
      </div>
    </React.Fragment>
  );
};

export default Ad;