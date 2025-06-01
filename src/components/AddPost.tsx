import React from "react";
import Image from "next/image";

interface AddPostProps {
  children?: React.ReactNode;
}

const AddPost: React.FC<AddPostProps> 
= (props: AddPostProps) => {
  const { children } = props;

  return (
    <React.Fragment>
      <div className="p-4 bg-white/50 rounded-lg flex
        gap-6 justify-between shadow-md text-sm
      ">
        {/* avatar part */}
        <div className="
            ring-2 ring-blue-200 rounded-full 
            overflow-hidden cursor-pointer
            w-10 h-10">
          <Image 
            src="/images/default.jpg" 
            width={80} 
            height={80} 
            alt="avatar" 
            className="object-cover"
          />
        </div>

        {/* post part */}
        <div className="flex-1">
          {/*text input  */}
          <div className="p-1 flex gap-4 items-center justify-start">
            <textarea 
              name="" 
              id="" 
              cols={30}
              rows={1}
              maxLength={1000}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              autoFocus={false}
              className="
                w-full bg-transparent p-2 rounded-lg flex-1
                outline-none placeholder:text-sm
                placeholder:text-gray-400 scrollbar-hide
                focus:border-blue-500 focus:ring focus:ring-blue-200 
                focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white
                focus:bg-gray
              "
              style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              placeholder="What's on your mind?"
            />
            <Image 
              src="/images/emoji.png" 
              width={24} 
              height={24} 
              alt="emoji"
              className="cursor-pointer object-contain"
            />
          </div>

          {/* post options */}
          <div 
            className="
              flex items-center justify-start gap-6
              mt-4 text-gray-400 px-3 flex-wrap"
          >
            <div className="
              flex gap-2 items-center text-blue-800
              hover:text-blue-500 cursor-pointer
            ">
              <Image 
                src="/images/addphoto.png" 
                width={24} 
                height={24} 
                alt="emoji"
                className="cursor-pointer object-contain"
              />
              AddPhoto~😘
            </div>
            <div className="
              flex gap-2 items-center text-blue-400
              hover:text-blue-800 cursor-pointer
            ">
              <Image 
                src="/images/addvideo.png" 
                width={24} 
                height={24} 
                alt="emoji"
                className="cursor-pointer object-contain"
              />
              AddVideo~😉
            </div>
            <div className="
              flex gap-2 items-center text-green-400
              hover:text-green-800 cursor-pointer
            ">
              <Image 
                src="/images/addevent.png" 
                width={24} 
                height={24} 
                alt="emoji"
                className="cursor-pointer object-contain"
              />
              AddEvent~🚀
            </div>
            <div className="
              flex gap-2 items-center text-purple-400
              hover:text-purple-800 cursor-pointer
            ">
              <Image 
                src="/images/addpoll.png" 
                width={24} 
                height={24} 
                alt="emoji"
                className="cursor-pointer object-contain"
              />
              AddPoll~😪
            </div>
          </div>
        </div>
      </div>
      {children}
    </React.Fragment>
  )
}

export default AddPost;