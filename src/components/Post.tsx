import React from "react";
import Image from "next/image";

interface PostProps {
  children?: React.ReactNode;
}

const Post: React.FC<PostProps> 
= (props: PostProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 shadow-md p-4 rounded-lg">
        {/* user part */}
        <div className="flex gap-4 items-center justify-between">
          <div className="rounded-full flex items-center gap-2">
            <Image 
              src="/images/default.jpg" 
              width={40} 
              height={40} 
              alt="avatar" 
              className="rounded-full object-cover"
            />
            <span className="font-semibold gradient-text flex-start">
              JuWenZhang
            </span>
          </div>
          <Image 
            src="/images/more.png"
            width={16}
            height={16}
            alt="verified"
            className="w-6 h-6"
          />
        </div>
        {/* DESC part */}
        <div className="flex flex-col">
          <div className="w-full min-h-96 relative">
            <Image
              src="/images/default.jpg"
              fill
              alt="post"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
        {/* interactions */}
        <div className=""></div>
      </div>
      {children}
    </React.Fragment>
  )
}

export default Post;