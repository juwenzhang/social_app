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
          <span className='font-semibold gradient-text'>User Media</span>
          <Link
            href={`/user/${userId}`}
            className='text-sm text-blue-500 font-semibold'
          >
            See All
          </Link>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserInforCard;