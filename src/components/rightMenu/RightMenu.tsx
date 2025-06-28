import React from'react';
import FriendRequest from '@/components/rightMenu/FriendReuest';
import Birthday from '@/components/rightMenu/Birthday';
import Ad from '@/components/Ad';
import { auth } from '@clerk/nextjs/server'
import UserInforCard from '@/components/rightMenu/UserInforCard';
import UserMediaCard from '@/components/rightMenu/UserMediaCard';
import { Suspense } from 'react';

interface RightMenuProps{
  children?: React.ReactNode;
  userId?: string;
  type: string;
}

const RightMenu: React.FC<RightMenuProps>
= async (props: RightMenuProps) => {
  const {
    children, 
    userId,
    type
  } = props;
  const userinfo = await auth();

  return(
    <React.Fragment>
      <div className='flex flex-col gap-4 rounded-md'>
        {userId && (
          <>
            <Suspense>
              <UserInforCard userId={userId} type={type} />
            </Suspense>
            <Suspense>
              <UserMediaCard userId={userId} />
            </Suspense>
          </>
        )}
        {
          ((userinfo as {userId: string}).userId === userId) && userId && (
            <>
              <FriendRequest userId={userId} />
            </>
          )
        }
        {
          userId && <Birthday userId={userId} />
        }
        <Ad size='md' userId={userId as string} />
        {children} 
      </div>
    </React.Fragment>
  );
}

export default RightMenu;