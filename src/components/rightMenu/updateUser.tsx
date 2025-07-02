"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Image as ImageKit } from '@imagekit/next';
import Image from 'next/image';

interface UpdateUserType {
  user: any;
  type?: string;
}

const UpdateUser: React.FC<UpdateUserType> = (props: UpdateUserType) => {
  const { user } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 用于封面文件上传的状态
  const [coverFile, setCoverFile] = useState<File | null>(null); 

  // 处理表单提交，使用 FormData 收集数据
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 如果有封面文件，追加到 FormData 中
    if (coverFile) {
      formData.append('cover', coverFile); 
    }
    // formData.append('id', user.id);  // 暗水印字段
    // formData.append('username', user.username);  // 明水印字段

    try {
      const res = await fetch(`/api/user/update/${user.id}`, {
        method: 'POST',
        body: formData, 
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.log('提交失败：', error);
    } finally {
      setIsOpen(false);
      setCoverFile(null);
      router.push(`/profile/${user.id}`);
    }
  };

  // 处理封面文件选择
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

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
      {isOpen && (
        <div 
          className='fixed h-screen w-screen top-0 left-0 bg-block/50 
            flex items-center justify-center z-50'
        >
          {/* 绑定 onSubmit 事件 */}
          <form 
            onSubmit={handleSubmit}
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
                {/* 显示当前封面 */}
                <Image
                  src={coverFile ? URL.createObjectURL(coverFile) : user?.cover}
                  width={48}
                  height={32}
                  alt='cover'
                  className='object-cover w-12 rounded-md shadow-md'
                />
                {/* 隐藏的文件输入框，用于选择封面 */}
                <input
                  type="file"
                  id="cover"
                  name="cover"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                <span 
                  className='text-xs underline text-gray-500'
                  onClick={() => {
                    // 触发文件选择
                    document.getElementById('cover')?.click(); 
                  }}
                >
                  Change
                </span>
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
                <label htmlFor="School" className='text-xs text-gray-500 cursor-pointer'>School</label>
                <input 
                  type="text" 
                  placeholder={user.school} 
                  name='School'
                  id='School'
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
                setCoverFile(null);
              }}>
              <ImageKit
                src={'/images/close.png'}
                width={32}
                height={32}
                alt='close'
              />
            </div>
            <div className='flex justify-center'>
              <button
                type='submit'
                className='
                  bg-gradient-to-r from-orange-500 to-red-500
                  text-white rounded-md px-4 py-1 font-semibold
                  mt-2 p-2 
                '
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;