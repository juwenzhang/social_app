import React from 'react';
import Feed from '@/components/Feed';
import LeftMenu from '@/components/LeftMenu';
import RightMenu from '@/components/RightMenu';

interface ProfilePageProps{
  // children?: React.ReactNode;
}

const ProfilePage:React.FC<ProfilePageProps> 
= () => {
  return(
    <React.Fragment>
      <div className='flex gap-6 pt-6'>
        <div className='hidden xl:block w-[20%]'>
          <LeftMenu />
        </div>
        <div className='w-full lg:w-[70%] xl:w-[50%]'>
          <div className='flex flex-col gap-4'>
            <Feed />
          </div>
        </div>
        <div className='hidden lg:block w-[30%]'>
          <RightMenu 
            userId='1234567890'
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfilePage;