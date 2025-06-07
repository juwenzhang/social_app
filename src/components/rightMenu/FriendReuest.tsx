import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FriendRequestProps{
  children?: React.ReactNode;
}

const FriendRequest: React.FC<FriendRequestProps>
= (props: FriendRequestProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 
        shadow-md text-sm flex flex-col gap-2'>
        {/* top */}
        <div className='flex justify-between 
          items-center font-semibold'>
          <span className='gradient-text'>
            Friends Request
          </span>
          <Link
            href='/'
            className='text-sm gradient-text font-semibold'>
            See All
          </Link>
        </div>

        {/* content */}
        <div className='px-4 py-2 flex flex-col 
          justify-center items-center gap-4 shadow-md 
          bg-white/20 rounded-md'>
          <div className='w-full font-semibold flex 
            justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/default.jpg'
                width={32}
                height={32}
                alt='Image'
                loading='lazy'
                className='size-10 object-cover ring-1 rounded-full'
              />
              <span>JUWENZHANG</span>
            </div>
            <div className='flex gap-2 items-center justify-center'>
              <Image
                src='/images/accept.png'
                alt='accept'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
              <Image
                src='/images/reject.png'
                alt='reject'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
            </div>
          </div>

          <div className='w-full font-semibold flex 
            justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/default.jpg'
                width={32}
                height={32}
                alt='Image'
                loading='lazy'
                className='size-10 object-cover ring-1 rounded-full'
              />
              <span>JUWENZHANG</span>
            </div>
            <div className='flex gap-2 items-center justify-center'>
              <Image
                src='/images/accept.png'
                alt='accept'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
              <Image
                src='/images/reject.png'
                alt='reject'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
            </div>
          </div>

          <div className='w-full font-semibold flex 
            justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/default.jpg'
                width={32}
                height={32}
                alt='Image'
                loading='lazy'
                className='size-10 object-cover ring-1 rounded-full'
              />
              <span>JUWENZHANG</span>
            </div>
            <div className='flex gap-2 items-center justify-center'>
              <Image
                src='/images/accept.png'
                alt='accept'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
              <Image
                src='/images/reject.png'
                alt='reject'
                width={20}
                height={20}
                loading='lazy'
                className='size-6 object-cover cursor-pointer'
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FriendRequest;