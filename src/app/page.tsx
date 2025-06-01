import React from 'react';
import LeftMenu from '@/components/LeftMenu';
import RightMenu from '@/components/RightMenu';
import Stories from '@/components/Stories';
import AddPost from '@/components/AddPost';
import Feed from '@/components/Feed';

interface HomePageProps{
  children?: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const {children} = props;
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
          <RightMenu 
            userId='1234567890'
          />
        </div>
        {children}
      </div>
    </React.Fragment>
  );
}

export default HomePage;
