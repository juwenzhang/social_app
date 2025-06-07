import React from 'react';
import Image from 'next/image';

interface CommentProps{
  children?: React.ReactNode;
}

const Comments: React.FC<CommentProps>
= (props: CommentProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='mt-4 p-4 bg-white/50 rounded-lg shadow-md'>
        {/* write */}
        <div className='flex items-center gap-4'>
          <Image
            src='/images/default.jpg'
            alt='Image Do Not Load'
            width={32}
            height={32}
            loading='lazy'
            className='rounded-full object-cover ring-2 ring-gray-300'
          />
          <div className='flex-1 flex items-center justify-center gap-2'>
            <input 
              name="" 
              id="" 
              maxLength={1000}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              autoFocus={false}
              className="
                w-full bg-gray-100 p-2 rounded-lg flex-1
                outline-none placeholder:text-sm
                placeholder:text-gray-400 resize-none scrollbar-hide
                focus:border-blue-500 focus:ring focus:ring-blue-200 
                focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white
              "
              placeholder="Write Some Comments Here"
            />
            <Image
              src='/images/emoji.png'
              alt='Image Do Not Load'
              width={24}
              height={24}
              loading='lazy'
              className='cursor-pointer hover:opacity-75 transition-opacity'
            />
          </div>
        </div>

        {/* comment */}
        <div className='mt-6 flex gap-3 items-start p-3'>
          {/* avatar */}
          <Image
            src='/images/default.jpg'
            alt='Image Do Not Load'
            width={32}
            height={32}
            loading='lazy'
            className='w-8 h-8 rounded-full object-cover ring-2 ring-gray-300'
          />

          {/* DESC */}
          <div className='w-[90%] flex flex-col gap-2'>
            {/* username */}
            <span className='font-semibold text-gray-800'>
              G.G.Bond
            </span>
            
            {/* detail comment */}
            <p className='break-words text-gray-600'>
              One of your pages that leverages the next/image component, passed a src value that uses a hostname in the URL that isn't defined in the images.remotePatterns in next.config.js.
            </p>

            {/* iterator */}
            <div className='flex gap-4 items-center cursor-pointer'>
              <div className='flex'>
                <Image
                  src='/images/like.png'
                  alt='Image Do Not Load'
                  width={16}
                  height={16}
                  loading='lazy'
                  className='object-contain 
                    hover:opacity-75 transition-opacity'
                />
                <span className='m-1 text-sm text-gray-600'>123</span>
              </div>
              <div className='flex cursor-pointer'>
                <Image
                  src='/images/reply.png'
                  alt='Image Do Not Load'
                  width={16}
                  height={16}
                  loading='lazy'
                  className='object-contain 
                    hover:opacity-75 transition-opacity'
                />
                <span className='m-1 text-sm text-gray-600'>123</span>
              </div>
            </div>
          </div> 

          {/* icon */}
          <Image
            src='/images/more.png'
            alt='Image Do Not Load'
            width={16}
            height={16}
            loading='lazy'
            className='cursor-pointer object-contain 
              hover:opacity-75 transition-opacity'
          />
        </div>
        {children}
      </div>
    </React.Fragment>
  );
}

export default Comments;