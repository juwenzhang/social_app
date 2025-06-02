import React from "react";
import Image from "next/image";

interface PostInterItemProps {
  children?: React.ReactNode;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  count?: number;
  type?: string;
  className?: string;
}

const PostInterItem: React.FC<PostInterItemProps> 
= (props: PostInterItemProps) => {
  const { 
    children, 
    src, 
    alt = "Image Do Not Load", 
    width = 16, 
    height = 16, 
    title = "Image", 
    count = 0, 
    type,
    className 
  } = props;
  
  return (
    <React.Fragment>
      <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-100 
          rounded-xl px-2 py-1">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            title={title}
            loading="lazy"
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 flex gap-2">
            {count}
            <span className="hidden md:inline">{title}</span>
          </span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PostInterItem;