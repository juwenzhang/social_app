import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserInfoCardProps {
  children?: React.ReactNode;
  userId?: string;
}

const UserInforCard: React.FC<UserInfoCardProps> 
= (props: UserInfoCardProps) => {
  const {
    children,
    userId
  } = props;
  return(
    <React.Fragment>
      <div className='p-4 bg-white/50 rounded-lg shadow-md 
        text-sm flex flex-col gap-4'
      >
        {/* top */}
        <div className='flex justify-between items-center font-medium'>
          <span className='font-semibold gradient-text'>User Information</span>
          <Link
            href={`/user/${userId}`}
            className='text-sm text-blue-500 font-semibold'
          >
            See All
          </Link>
        </div>

        {/* detail info */}
        <div className='flex flex-col gap-4 
          text-blue-500/50 font-medium'>
          <div className='flex items-center gap-2'>
            <span className='text-xl text-black'>JuWenZhang</span>
            <span className='text-blue-500'>
              <i>
                <strong>
                  @bytedance
                </strong>
              </i>
            </span>
          </div>
          <p className='text-gray-500'>
            欢迎访问我的个人博客，这里是我的技术分享和生活记录。
            如果你有任何问题或建议，欢迎联系我。
            让我们一起探索技术的世界，分享知识和经验。
            欢迎来到我的博客！
          </p>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/city.png' 
              width={20} 
              height={20} 
              alt='city'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              I Am Living In 
              &nbsp;
              <i>
                <strong className='text-black'>
                  ShangHai
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/school.png' 
              width={20} 
              height={20} 
              alt='school'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              I Study In 
              &nbsp;
              <i>
                <strong className='text-black'>
                  Post University
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/work.png' 
              width={20} 
              height={20} 
              alt='work'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              I Work In
              &nbsp;
              <i>
                <strong className='text-black'>
                  ByteDance
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/github.png' 
              width={20} 
              height={20} 
              alt='github'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              My Github Is
              &nbsp;
              <i>
                <strong className='text-black'>
                  <Link 
                    href="https://github.com/juwenzhang"
                    target='_self'
                  >
                    juwenzhang
                  </Link>
                </strong>
              </i>
            </span>
          </div>
          <div className='flex gap-2 text-gray-500 tiems-center'>
            <Image 
              src='/images/juejin.png' 
              width={20} 
              height={20} 
              alt='juejin'
              loading='lazy'
              className='object-cover' 
            />
            <span className='ml-2'>
              My JueJin Is
              &nbsp;
              <i>
                <strong className='text-black'>
                  <Link 
                    href="https://juejin.cn/user/3877322821505440"
                    target='_self'
                  >
                    76433橘子
                  </Link>
                </strong>
              </i>
            </span>
          </div>
        </div>

        {/* button */}
        <button 
          className='
            w-full py-2 font-semibold text-white 
            bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg
            hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500
            cursor-pointer transition-all duration-300 ease-in-out
          '
        >Fellow Me</button>
        <span
          className='text-red-400 self-end text-xs cursor-pointer'
        >Block User</span>
      </div>
    </React.Fragment>
  )  
}

export default UserInforCard;