import React from'react';
import Image from 'next/image';

interface BirthdayProps{
  children?: React.ReactNode;
}

const Birthday: React.FC<BirthdayProps>
= (props: BirthdayProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='p-2 rounded-md bg-white/50 
        shadow-md text-sm flex flex-col gap-2'>
        {/* top */}
        <div className='flex justify-between 
          items-center font-semibold'>
          <span className='gradient-text'>
            BirthDay
          </span>
        </div>

        {/* user */}
        <div className='w-full font-semibold flex 
          justify-between items-center p-2 bg-white/20 
          rounded-md shadow-md'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/default.jpg'
              width={32}
              height={32}
              alt='Image'
              loading='lazy'
              className='size-10 object-cover ring-1 rounded-full'
            />
            <span>JUWENZHANG</span>
          </div>
          <div className='flex gap-2 items-center justify-center'>
            <button
              className='bg-blue-500/50 text-white
              text-xs px-2 py-2 rounded-md'
            >
              Celebrate
            </button>
          </div>
        </div>

        {/* UPCOMING */}
        <div className='p-4 bg-white/40 rounded-md shadow-md'>

        </div>
      </div>
    </React.Fragment>
  )
}

export default Birthday;