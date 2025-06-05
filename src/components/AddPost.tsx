import React from "react";
import Image from "next/image";
import { toast } from '@/contexts/provider/ToastSsrProvider';
import { auth } from '@clerk/nextjs/server'
import { createPost } from "@/libs/postService";

interface AddPostProps {
  children?: React.ReactNode;
}

const AddPost: React.FC<AddPostProps> = (
  props: AddPostProps
) => {
  const textAction = async (
    formData: FormData,
  ) => {
    const { userId } = await auth()
    try {
      const desc = formData.get("desc");
      await createPost(
        userId as string,
        desc as string,
      );
      toast.success("add post successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("add post error" + error.message);
      }
    }
  }

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
            loading="lazy"
            className="object-cover"
          />
        </div>

        {/* post part */}
        <div className="flex-1">
          {/*text input  */}
          <form 
            action={textAction} 
            className="p-1 flex gap-4 items-center justify-start"
          >
            <textarea 
              name="desc" 
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
              loading="lazy"
              className="cursor-pointer object-contain"
            />
            <button type='submit'>
              <Image
                src="/images/reply.png"
                width={24}
                height={24}
                alt="post"
                loading="lazy"
                className="cursor-pointer object-contain"
              />
            </button>
          </form>

          {/* post options */}
          <div 
            className="
              flex items-center justify-start gap-6
              mt-3 text-gray-400 px-1 flex-wrap"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
                className="cursor-pointer object-contain"
              />
              AddPoll~😪
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AddPost;