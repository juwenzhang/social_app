"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Image as ImageKit } from '@imagekit/next'
import Image from 'next/image';

interface UpdateUserType {
  user: any,
  type: string
}

const UpdateUser: React.FC<UpdateUserType> = (props: UpdateUserType) => {
  const { user, type } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = async () => {
    setIsOpen(false);
    if (type === 'home') {
      router.push(`/`);
    } else if (type === 'admin') {
      router.push(`/profile/${user.id}`);
    }
  }
  return (
    <React.Fragment>
      <div
        className="text-sm gradient-text font-semibold cursor-pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        UpdateUser
      </div>
      {
        isOpen && (
          <div 
            className='fixed h-screen w-screen top-0 left-0 bg-block/50 
              flex items-center justify-center z-50'
          >
            <form 
              action=""
              className='relative p-12 rounded-lg shadow-md flex 
                flex-col gap-2 w-full md:w-1/2 xl:w-1/3 bg-white/85 justify-center'
            >
              <h1 className='font-bold text-xl gradient-text'>Update Profile</h1> 
              <div className='font-bold mt-3 text-md gradient-text'>
                Please Use Navbar To Update Your Avatar, Username, Email And Password
              </div>

              <div className='flex flex-col my-4 w-full'>
                <label htmlFor="cover" 
                  className='text-md text-gray-500'>
                    Cover Picture
                </label>
                <div className='flex items-center gap-4 cursor-pointer'>
                  <Image
                    src={user?.cover}
                    width={48}
                    height={32}
                    alt='cover'
                    className='object-cover w-12 rounded-md shadow-md'
                  />
                  <span className='text-xs underline text-gray-500'>Change</span>
                </div>
              </div>

              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="enterprise" className='text-xs text-gray-500 cursor-pointer'>EnterPrise</label>
                  <input 
                    type="text" 
                    placeholder={user.enterprise} 
                    name='enterprise'
                    id='enterprise'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="description" className='text-xs text-gray-500 cursor-pointer'>Description</label>
                  <input 
                    type="text" 
                    placeholder={user.description} 
                    name='description'
                    id='description'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="github_name" className='text-xs text-gray-500 cursor-pointer'>GitHub Name</label>
                  <input 
                    type="text" 
                    placeholder={user.github_name} 
                    name='github_name'
                    id='github_name'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="github_link" className='text-xs text-gray-500 cursor-pointer'>Github Link</label>
                  <input 
                    type="text" 
                    placeholder={user.github_link} 
                    name='github_link'
                    id='github_link'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="juejin_name" className='text-xs text-gray-500 cursor-pointer'>Juejin Name</label>
                  <input 
                    type="text" 
                    placeholder={user.juejin_name} 
                    name='juejin_name'
                    id='juejin_name'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor="juejin_link" className='text-xs text-gray-500 cursor-pointer'>Juejin Link</label>
                  <input 
                    type="text" 
                    placeholder={user.juejin_link} 
                    name='juejin_link'
                    id='juejin_link'
                    className='
                      border border-gray-500 rounded-md px-2 py-1
                      focus:outline-none focus:border-blue-500 w-[400px]
                    '
                  />
                </div>
              </div>

              <div 
                className='absolute top-3 right-2 text-2xl cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}>
                <ImageKit
                  src={'/images/close.png'}
                  width={32}
                  height={32}
                  alt='close'
                />
              </div>
            </form>
          </div>
        )
      }
    </React.Fragment>
  );
}

export default UpdateUser;