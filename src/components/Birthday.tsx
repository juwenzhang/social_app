import React from'react';

interface BirthdayProps{
  children?: React.ReactNode;
}

const Birthday: React.FC<BirthdayProps>
= (props: BirthdayProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 shadow-md'>
        hello world
      </div>
    </React.Fragment>
  )
}

export default Birthday;