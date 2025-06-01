import React from 'react';
import Image from 'next/image';

interface PostUserProps{
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  username?: string;
}

const PostUser: React.FC<PostUserProps>
= (props: PostUserProps) => {
  const {
    children,
    src = '/images/default.jpg',
    alt = 'Image Do Not Load',
    width = 40,
    height = 40,
    title = 'Image',
    username = 'juwenzhang',
    className
  } = props;

  return(
    <React.Fragment>
      <div className='flex gap-4 items-center justify-between'>
        <div className='rounded-full flex items-center gap-2'>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            title={title}
            className='rounded-full object-cover'
          />
          <span className='font-semibold gradient-text flex-start'>{username}</span>
        </div>
        <Image
          src='/images/more.png'
          alt='More'
          width={16}
          height={16}
          className='w-6 h-6'
        />
      </div>
    </React.Fragment>
  )
}

export default PostUser;