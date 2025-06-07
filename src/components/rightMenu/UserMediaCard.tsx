import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/libs/client';
import { auth } from '@clerk/nextjs/server';

interface UserMediaCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const UserMediaCard: React.FC<UserMediaCardProps> 
= async (props: UserMediaCardProps) => {
  const {
    userId
  } = props;
  const postsWithMedia = await prisma.post.findMany({
    where: {
      userId: userId,
      image: {
        not: null
      }
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    }
  })
  const { userId: currentUserId } = (await auth());
  return(
    <React.Fragment>
      <div className='p-4 bg-white/50 rounded-lg shadow-md 
        text-sm flex flex-col gap-4'
      >
        {/* top */}
        <div className='flex justify-between items-center font-medium'>
          <span className='font-semibold gradient-text'>User Media</span>
          {(currentUserId !== userId) && <Link
            href={`/user/${userId}`}
            className='text-sm gradient-text font-semibold'
          >
            See All
          </Link>}
        </div>
        {/* bottom */}
        <div className='flex gap-4 items-start justify-between flex-wrap'>
          {postsWithMedia.length ? postsWithMedia.map((post) => {
            return (
              <div className='relative w-1/5 h-24' key={post.id}>
                <Image
                  src={ post.image as string }
                  fill
                  alt={post.desc as string}
                  loading='lazy'
                  className='object-cover rounded-md'
                />
              </div>
            )
          }) : (
            <div className='flex flex-col items-center justify-center w-full h-24'>
              <span className='text-sm text-black/50'>No media yet</span>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserMediaCard;