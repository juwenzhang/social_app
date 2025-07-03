import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/libs/client';
import { auth } from '@clerk/nextjs/server';

interface UserMediaCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const UserMediaCard: React.FC<UserMediaCardProps> = async (props: UserMediaCardProps) => {
  const { userId } = props;

  const postNum = await prisma.post.count({
    where: { userId },
  });

  const postsWithMedia = await prisma.post.findMany({
    where: { 
      userId,
      OR: [
        { fileUrls: { not: null } },
        // { fileUrls: { not: '' } },
        { fileTypes: { not: null } },
        // { fileTypes: { not: '' } }
      ]
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });
  
  const { userId: currentUserId } = (await auth()) || {};

  const parseSemicolonString = (str: string | null | undefined): string[] => {
    if (!str || str.trim() === '') return [];
    return str.split(';').filter(item => item.trim() !== '');
  };

  const getImageUrls = (post: { fileUrls?: string | null; fileTypes?: string | null }): string[] => {
    const urls = parseSemicolonString(post.fileUrls);
    const types = parseSemicolonString(post.fileTypes);

    return urls.filter((_, index) => {
      const type = types[index] || '';
      return type.startsWith('image/');
    });
  };

  return (
    <React.Fragment>
      <div className='p-4 bg-white/50 rounded-lg shadow-md text-sm flex flex-col gap-4'>
        <div className='flex justify-between items-center font-medium'>
          <span className='font-semibold gradient-text'>User Media</span>
          {postNum > 8 && currentUserId === userId && (
            <Link href={`/image/${userId}`} className='text-sm gradient-text font-semibold'>
              See All
            </Link>
          )}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
          {postsWithMedia && postsWithMedia.flatMap(post => {
            const imageUrls = getImageUrls(post);
            return imageUrls.map((url, index) => (
              <div key={`${post.id}-${index}`} className='relative aspect-square overflow-hidden rounded-md shadow-md'>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={url}
                    fill
                    alt={post.desc || 'User media'}
                    loading='lazy'
                    className='object-cover transition-transform duration-300 hover:scale-110'
                  />
                </Link>
              </div>
            ));
          })}

          {postsWithMedia.length === 0 && (
            <div className='col-span-full flex flex-col items-center justify-center h-24'>
              <span className='text-sm text-black/50'>No media yet</span>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserMediaCard;