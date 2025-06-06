import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUserFolowers } from '@/libs/userService';
import { auth } from '@clerk/nextjs/server';

interface ProfileCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const ProfileCard: React.FC<ProfileCardProps> 
= async (props: ProfileCardProps) => {
  const { userId } = (await auth());
  if(!userId) return;
  const user = await getUserFolowers(userId!);
  if(!user) return
  return(
    <React.Fragment>
      <div className='bg-white/50 rounded-md p-2
        flex flex-col gap-4 shadow-md
      '>
        <div className='h-20 relative mb-2 shadow-md'>
          <Image
            src={user!.cover as string}
            fill
            alt='Image'
            loading='lazy'
            className='object-cover rounded-lg'
          />
          <div className='w-15 h-15 rounded-full ring-2 
            ring-blue-300/50 overflow-hidden
            absolute left-[50%] translate-x-[-50%] bottom-[-30%]'
          >
            <Image 
              src={user!.avatar as string}
              alt='default'  
              width={100}
              height={100}
              loading='lazy'
              className='object-cover shadow-md'
            />
          </div>
        </div>

        <div className='flex flex-col items-center gap-2 p-2'>
          <span className='font-semibold gradient-text text-lg'>
            { user!.username || 'Username' }
          </span>
          <div className='gradient-text'>
            <span className='text-gray-500'>
              { user._count.followers }
              &nbsp;
              <i>
                <strong>
                  Fellows
                </strong>
              </i>
            </span>
          </div>
          <button>
            <Link
              href={`/profile/${userId}`}
              className='font-semibold
              bg-blue-500 rounded-md p-2
              text-white hover:bg-blue-600
              bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg
              hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
              cursor-pointer transition-all duration-300 ease-in-out
            '>
              My Profile
            </Link>
          </button>
        </div>   
      </div>
    </React.Fragment>
  )
}

export default ProfileCard;