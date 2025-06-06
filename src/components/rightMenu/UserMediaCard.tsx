import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserMediaCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const UserMediaCard: React.FC<UserMediaCardProps> 
= (props: UserMediaCardProps) => {
  const {
    children,
    userId
  } = props;
  return(
    <React.Fragment>
      <div className='p-4 bg-white/50 rounded-lg shadow-md 
        text-sm flex flex-col gap-4'
      >
        {/* top */}
        <div className='flex justify-between items-center font-medium'>
          <span className='font-semibold gradient-text'>User Media</span>
          <Link
            href={`/user/${userId}`}
            className='text-sm text-blue-500 font-semibold'
          >
            See All
          </Link>
        </div>
        {/* bottom */}
        <div className='flex gap-4 items-start justify-between flex-wrap'>
          {Array.from({ length: 8 }).map((_, index) => {
            return (
              <div className='relative w-1/5 h-24' key={index}>
                <Image
                  src='/images/default.jpg'
                  fill
                  alt='default'
                  loading='lazy'
                  className='object-cover rounded-md'
                />
              </div>
            )
          })}
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserMediaCard;