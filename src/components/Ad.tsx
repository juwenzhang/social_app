import React from 'react';

interface AdProps{
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Ad: React.FC<AdProps>
= (props: AdProps) => {
  const {
    children,
    size = 'md'
  } = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 
        shadow-md text-sm'>
        {children}
      </div>
    </React.Fragment>
  )
}

export default Ad;