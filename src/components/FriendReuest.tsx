import React from 'react';

interface FriendRequestProps{
  children?: React.ReactNode;
}

const FriendRequest: React.FC<FriendRequestProps>
= (props: FriendRequestProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 shadow-md'>
        hello world
      </div>
    </React.Fragment>
  )
}

export default FriendRequest;