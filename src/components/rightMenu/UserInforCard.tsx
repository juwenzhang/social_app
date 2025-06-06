import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/libs/userService';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/libs/client';

interface UserInfoCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const UserInforCard: React.FC<UserInfoCardProps> 
= async (props: UserInfoCardProps) => {
  const {
    userId
  } = props;
  const user = await getUser(userId!);
  if (!user) return notFound();

  const createDate = new Date(user.createdAt).toLocaleDateString(
    'en-US', 
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const { userId: currentUserId } = (await auth());
  let isFollowed = false;
  if (currentUserId) {
    if (currentUserId!== userId) {
      const res = await prisma.follower.findFirst({
        where: {
          followerId: currentUserId,
          followingId: userId,
        }
      });
      if(res) isFollowed = true;
    } else {
      isFollowed = false;
    }
  }
  return(
    <React.Fragment>
      <div className='p-4 bg-white/50 rounded-lg shadow-md 
        text-sm flex flex-col gap-4'
      >
        {/* top */}
        <div className='flex justify-between items-center font-medium'>
          <span className='font-semibold gradient-text'>User Information</span>
          <Link
            href={`/user/${userId}`}
            className='text-sm text-blue-500 font-semibold'
          >
            See All
          </Link>
        </div>

        {/* detail info */}
        <div className='flex flex-col gap-4 
          text-blue-500/50 font-medium'>
          <div className='flex items-center gap-2'>
            <span className='text-xl text-black'>
              { user?.username }
            </span>
            <span className='text-blue-500'>
              <i>
                <strong>
                  @{user.enterprise}
                </strong>
              </i>
            </span>
          </div>
          <p className='text-gray-500'>
            {user.description}
          </p>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/city.png' 
              width={20} 
              height={20} 
              alt='city'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              Living In 
              &nbsp;
              <i>
                <strong className='text-black'>
                  { user.city }
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/school.png' 
              width={20} 
              height={20} 
              alt='school'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              Studying In 
              &nbsp;
              <i>
                <strong className='text-black'>
                  { user.school }
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/work.png' 
              width={20} 
              height={20} 
              alt='work'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              Working In
              &nbsp;
              <i>
                <strong className='text-black'>
                  { user.enterprise }
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/github.png' 
              width={20} 
              height={20} 
              alt='github'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              Github Is
              &nbsp;
              <i>
                <strong className='text-black'>
                  <Link 
                    href={user.github_link as string}
                    target='_self'
                  >
                    { user.github_name }
                  </Link>
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/juejin.png' 
              width={20} 
              height={20} 
              alt='juejin'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              JueJin Is
              &nbsp;
              <i>
                <strong className='text-black'>
                  <Link 
                    href={user.juejin_link as string}
                    target='_self'
                  >
                    { user.juejin_name }
                  </Link>
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image
              src='/images/date.png'
              width={20}
              height={20}
              alt='date'
              loading='lazy'
              className='object-cover'
            />
            <span className='ml-2'>
              Joined At
              &nbsp;
              <i>
                <strong className='text-black'>
                  { createDate }
                </strong>
              </i>
            </span>
          </div>
        </div>

        {/* button */}
        {currentUserId !== userId && <button 
          className='
            w-full py-2 font-semibold text-white 
            bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg
            hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
            cursor-pointer transition-all duration-300 ease-in-out
          '
        >{ isFollowed ? "UnFollowed" : "Follow" }</button>}
        {currentUserId === userId && <span
          className='text-red-400 self-end text-xs cursor-pointer'
        >Block User</span>}
      </div>
    </React.Fragment>
  )  
}

export default UserInforCard;