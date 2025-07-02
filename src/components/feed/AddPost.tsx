"use client"
import React, { useState } from "react";

import Image from "next/image";
import { Image as ImageKit } from '@imagekit/next';
import { useRouter } from "next/navigation";

interface AddPostProps {
  children?: React.ReactNode;
  userId?: string;
  user?: any,
  type?: string;
}

const AddPost: React.FC<AddPostProps> = (
  props: AddPostProps
) => {
  const { user } = props;
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '  ' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
  } else if (e.key === 'Shift') {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '  ' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
  } else if (e.key === "B" && e.ctrlKey) {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '**' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
  } else if (e.key === "1" && e.ctrlKey) {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '# ' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
  } else if (e.key === "2" && e.ctrlKey) {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '## ' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
  } else if (e.key === "3" && e.ctrlKey) {
    e.preventDefault();
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    e.currentTarget.value = 
      e.currentTarget.value.substring(0, start)
      + '### ' + 
      e.currentTarget.value.substring(end);
    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
  }
};

const textAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('desc') as string;
    if (content.length === 0) {
      return;
    }
    if (image) {
      formData.append('image', image);
    }
    if (video) {
      formData.append('video', video);
    }
    try {
      const res = await fetch(`/api/post/create`, {
        method: 'POST',
        body: formData, 
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      } 
    } catch (error) {
      console.log('提交失败：', error);
    } finally {
      router.push(`/profile/${user.id}`);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
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
            src={ 
              user 
              ? (user["avatar"] ? user["avatar"] 
                : "/images/default.jpg") 
                : "/images/default.jpg"
            } 
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
            onSubmit={textAction}
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
              onKeyDown={handleKeyDown}
            />
            <div className="flex gap-4">
              <ImageKit 
                src="/images/emoji.png" 
                width={24} 
                height={24} 
                alt="emoji"
                loading="lazy"
                className="cursor-pointer object-contain"
              />
              <button type='submit'>
                <ImageKit
                  src="/images/reply.png"
                  width={24}
                  height={24}
                  alt="post"
                  loading="lazy"
                  className="cursor-pointer object-contain"
                />
              </button>
            </div>
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
            "
            onClick={() => {
              const fileInput = document.getElementById('image');
              if (fileInput) {
                fileInput.click();
              }
            }}>
              <ImageKit 
                src="/images/addphoto.png" 
                width={24} 
                height={24} 
                alt="emoji"
                loading="lazy"
                className="cursor-pointer object-contain"
              />
              <input
                type="file"
                id="image"
                name="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              AddPhoto~😘
            </div>
            <div className="
              flex gap-2 items-center text-blue-400
              hover:text-blue-800 cursor-pointer
            "
            onClick={() => {
              const fileInput = document.getElementById('video');
              if (fileInput) {
                fileInput.click();
              }
            }}>
              <ImageKit 
                src="/images/addvideo.png" 
                width={24} 
                height={24} 
                alt="emoji"
                loading="lazy"
                className="cursor-pointer object-contain"
              />
              <input 
                type="file" 
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                name="video/*" 
              />
              AddVideo~😉
            </div>
            <div className="
              flex gap-2 items-center text-green-400
              hover:text-green-800 cursor-pointer
            ">
              <ImageKit 
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
              <ImageKit 
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