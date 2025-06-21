import React from 'react';
import Link from 'next/link';
import FriendsRequestList from '@/components/rightMenu/FriendsRequestList';

interface FriendRequestProps{
  children?: React.ReactNode;
  userId?: string;
}

const FriendRequest: React.FC<FriendRequestProps>
= async (props: FriendRequestProps) => {
  const {children, userId} = props;
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
        <FriendsRequestList userId={userId as string} />
      </div>
    </React.Fragment>
  )
}

export default FriendRequest;