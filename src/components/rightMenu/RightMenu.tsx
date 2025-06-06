import React from'react';
import FriendRequest from '@/components/rightMenu/FriendReuest';
import Birthday from '@/components/rightMenu/Birthday';
import Ad from '@/components/Ad';
import UserInforCard from '@/components/rightMenu/UserInforCard';
import UserMediaCard from '@/components/rightMenu/UserMediaCard';
import { Suspense } from 'react';

interface RightMenuProps{
  children?: React.ReactNode;
  userId?: string;
}

const RightMenu: React.FC<RightMenuProps>
= (props: RightMenuProps) => {
  const {
    children, 
    userId
  } = props;
  return(
    <React.Fragment>
      <div className='flex flex-col gap-4 rounded-md'>
        {userId && (
          <>
            <Suspense>
              <UserInforCard userId={userId} />
            </Suspense>
            <Suspense>
              <UserMediaCard userId={userId} />
            </Suspense>
          </>
        )}
        <FriendRequest />
        <Birthday />
        <Ad size='md' />
        {children}
      </div>
    </React.Fragment>
  );
}

export default RightMenu;