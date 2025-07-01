import React from 'react';
import LeftMenu from '@/components/leftMenu/LeftMenu';
import RightMenu from '@/components/rightMenu/RightMenu';
import Stories from '@/components/Stories';
import AddPost from '@/components/feed/AddPost';
import Feed from '@/components/feed/Feed';
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/libs/userService';

interface HomePageProps{
  // children?: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = async () => {
  const { userId } = await auth();
  let user;
  if (userId) {
    user = await getUser(userId as string);
  } 
  return(
    <React.Fragment>
      <div className='flex gap-6 pt-6'>
        <div className='hidden xl:block w-[20%]'>
          <LeftMenu userId={userId as string} />
        </div>
        <div className='w-full lg:w-[70%] xl:w-[50%]'>
          <div className='flex flex-col gap-4'>
            <Stories userId={userId as string} />
            <AddPost userId={userId as string} user={user} />
            <Feed user={user} />
          </div> 
        </div>
        <div className='hidden lg:block w-[30%]'>
          <RightMenu userId={userId as string} type='home' />
        </div>
      </div>
    </React.Fragment>
  );
}

export default HomePage;
