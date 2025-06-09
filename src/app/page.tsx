import React from 'react';
import LeftMenu from '@/components/leftMenu/LeftMenu';
import RightMenu from '@/components/rightMenu/RightMenu';
import Stories from '@/components/Stories';
import AddPost from '@/components/feed/AddPost';
import Feed from '@/components/feed/Feed';

interface HomePageProps{
  // children?: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = async () => {
  return(
    <React.Fragment>
      <div className='flex gap-6 pt-6'>
        <div className='hidden xl:block w-[20%]'>
          <LeftMenu />
        </div>
        <div className='w-full lg:w-[70%] xl:w-[50%]'>
          <div className='flex flex-col gap-4'>
            <Stories />
            <AddPost />
            <Feed />
          </div>
        </div>
        <div className='hidden lg:block w-[30%]'>
          <RightMenu />
        </div>
      </div>
    </React.Fragment>
  );
}

export default HomePage;
