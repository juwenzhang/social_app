import React from 'react';

interface AdProps{
  children?: React.ReactNode;
  size?: string;
}

const Ad: React.FC<AdProps>
= (props: AdProps) => {
  const {
    children,
    size = 'sm'
  } = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 shadow-md'>
        hello world
        {children}
      </div>
    </React.Fragment>
  )
}

export default Ad;