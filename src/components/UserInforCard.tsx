import React from 'react';
import Link from 'next/link';

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
        <div className='flex flex-col gap-2 font-medium'>
          <div className='flex'>
            name
          </div>
          <div className='flex'>
            age
          </div>
          <div className='flex'>
            school
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
        >
          Fellow Me
        </button>
      </div>
    </React.Fragment>
  )  
}

export default UserInforCard;