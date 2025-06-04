import React from 'react';
import Image from 'next/image';
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
          <LeftMenu type='profile' userId='1234567890' />
        </div>
        <div className='w-full lg:w-[70%] xl:w-[50%]'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col p-4 gap-4
              items-center justify-center shadow-md rounded-md text-white/50'
            >
              <div className='w-full h-64 relative shadow-md mb-4'>
                <Image
                  src='/images/default.jpg'
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
                    src='/images/default.jpg'
                    alt='default'  
                    width={200}
                    height={200}
                    loading='lazy'
                    className='object-cover shadow-md'
                  />
                </div>
              </div>
              <div className='gradient-text font-semibold text-lg'>
                JUWENZHANG
              </div>
              <div className='flex items-center justify-between 
                gradient-text font-semibold w-[60%] p-4
              '>
                <div className='flex flex-col gap-2 items-center'>
                  <span className='font-medium'>
                    500
                  </span>
                  <span>Posts</span>
                </div>
                <div className='flex flex-col gap-2 items-center'>
                  <span className='font-medium'>
                    500
                  </span>
                  <span>Followers</span>
                </div>
                <div className='flex flex-col gap-2 items-center'>
                  <span className='font-medium'>
                    500
                  </span>
                  <span>Following</span>
                </div>
              </div>
            </div>
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