import React from'react';
import FriendRequest from '@/components/FriendReuest';
import Birthday from '@/components/Birthday';
import Ad from '@/components/Ad';
import UserInforCard from '@/components/UserInforCard';
import UserMediaCard from '@/components/UserMediaCard';

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
            <UserInforCard userId={userId} />
            <UserMediaCard userId={userId} />
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