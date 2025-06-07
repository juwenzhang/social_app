import React from 'react';
import Image from 'next/image';
import Feed from '@/components/feed/Feed';
import LeftMenu from '@/components/leftMenu/LeftMenu';
import RightMenu from '@/components/rightMenu/RightMenu';
import { auth } from '@clerk/nextjs/server';
import { getUser } from '@/libs/userService';
import { notFound } from 'next/navigation';
import prisma from '@/libs/client';
import { Suspense } from 'react';

const ProfilePage: React.FC<{
  params: { id: string }
}> = async (
  { params }: { params: { id: string } }
) => {
  // verify current user
  const { id } = await params;
  if(!id) return notFound(); 
  const user = await getUser(id!);
  if(!user) return notFound();

  // verify visit user is blocked by current user
  const { userId } = (await auth());
  let isBlocked = false;
  if (userId) {
    if (userId !== id) {
      const res = await prisma.block.findFirst({
        where: {
          blockerId: userId,
          blockedId: id,
        }
      });
      if(res) isBlocked = true;
    } else {
      isBlocked = false;
    }
  }
  if (isBlocked) return notFound();

  return(
    <React.Fragment>
      <div className='flex gap-6 pt-6'>
        <div className='hidden xl:block w-[20%]'>
          <LeftMenu type='profile' userId='1234567890' />
        </div>
        <Suspense>
          <div className='w-full lg:w-[70%] xl:w-[50%]'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col p-4 gap-4 bg-white/50
                items-center justify-center shadow-md rounded-md text-white/50'
              >
                <div className='w-full h-64 relative shadow-md mb-4'>
                  <Image
                    src={ user!.cover as string }
                    fill
                    alt='Image'
                    loading='lazy'
                    className='object-cover rounded-lg'
                  />
                  <div className='w-30 h-30 rounded-full ring-2 
                    ring-blue-300/50 overflow-hidden
                    absolute left-[50%] translate-x-[-50%] bottom-[-10%]'
                  >
                    <Image 
                      src={ user!.avatar as string }
                      alt='default'  
                      width={200}
                      height={200}
                      loading='lazy'
                      className='object-cover shadow-md'
                    />
                  </div>
                </div>
                <div className='gradient-text font-semibold text-lg'>
                  { user!.username || 'Username' }
                </div>
                <div className='flex items-center justify-between 
                  gradient-text font-semibold w-[60%] p-4
                '>
                  <div className='flex flex-col gap-2 items-center'>
                    <span className='font-medium'>
                      { user._count.posts }
                    </span>
                    <span>Posts</span>
                  </div>
                  <div className='flex flex-col gap-2 items-center'>
                    <span className='font-medium'>
                      { user._count.followers  }
                    </span>
                    <span>Followers</span>
                  </div>
                  <div className='flex flex-col gap-2 items-center'>
                    <span className='font-medium'>
                      { user._count.following  }
                    </span>
                    <span>Following</span>
                  </div>
                </div>
              </div>
              <Feed />
            </div>
          </div>
        </Suspense>
        <div className='hidden lg:block w-[30%]'>
          <RightMenu 
            userId={id} 
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfilePage;