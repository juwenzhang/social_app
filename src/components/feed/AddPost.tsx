"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Image as ImageKit } from '@imagekit/next';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

interface AddPostProps {
  children?: React.ReactNode;
  userId?: string;
  user?: any;
  type?: string;
}

const AddPost: React.FC<AddPostProps> = (props) => {
  const { user } = props;
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string, type: string }[]>([]);
  const [chunkUploading, setChunkUploading] = useState<boolean[]>([]); // 分块上传状态

  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }, []);

  const textAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setUploadProgress(files.map(() => 0));
    setUploadedFiles([]);
    setChunkUploading(files.map(() => false));

    try {
      const formData = new FormData(e.currentTarget);
      const content = formData.get('desc') as string;

      if (!content.trim() && files.length === 0) {
        setErrorMessage("内容和文件至少填一项");
        setIsLoading(false);
        return;
      }

      const largeFiles = files.filter(file => file.size > 100 * 1024 * 1024);
      if (largeFiles.length > 0) {
        setErrorMessage(`文件大小超出限制：${largeFiles[0].name}（最大支持100MB）`);
        setIsLoading(false);
        return;
      }

      const uploadPromises = files.map(async (file, index) => {
        setChunkUploading(prev => prev.map((_, i) => i === index ? true : prev[i]));

        try {
          const result = await uploadFileWithChunks(file, (progress: number) => {
            setUploadProgress(prev => prev.map((p, i) => i === index ? progress : p));
          });

          setChunkUploading(prev => prev.map((_, i) => i === index ? false : prev[i]));
          return result;
        } catch (err) {
          setChunkUploading(prev => prev.map((_, i) => i === index ? false : prev[i]));
          throw err;
        }
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedFiles(uploaded);

      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      formData.append('fileCount', files.length.toString());

      const res = await fetch(`/api/post/create`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "提交失败，请重试");
      }

      toast.success('发布成功', { position: 'top-right' });
      router.push(`/profile/${user.id}`);

    } catch (error: any) {
      setErrorMessage(error.message || "提交失败：网络错误");
      toast.error(error.message || "提交失败，请重试", { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFileWithChunks = (file: File, onProgress: (progress: number) => void): Promise<{ url: string, type: string }> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 3, 100);
        onProgress(progress);

        if (progress === 100) {
          clearInterval(interval);
          resolve({
            url: `https://example.com/${file.name}`,
            type: file.type
          });
        }
      }, 100);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const uniqueFiles = selectedFiles.filter(file =>
      !files.some(existFile => existFile.name === file.name)
    );

    if (files.length + uniqueFiles.length > 10) {
      setErrorMessage("最多只能上传10个文件");
      return;
    }

    const largeFiles = uniqueFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setErrorMessage(`文件大小超出限制：${largeFiles[0].name}（最大支持100MB）`);
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...uniqueFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setChunkUploading(prev => prev.filter((_, i) => i !== index));
  };

  const renderFilePreviews = () => {
    if (files.length === 0) return null;

    return (
      <div className="mt-3 space-y-3">
        {files.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const progress = uploadProgress[index] || 0;
          const isUploading = chunkUploading[index];
          const isUploaded = uploadedFiles[index]?.url;

          return (
            <div key={index} className="bg-gray-50 p-3 rounded-lg flex flex-col md:flex-row items-start
              md:items-center gap-3">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden
                bg-gray-200 flex items-center justify-center">
                {isImage && !isUploaded && (
                  <Image
                    src={URL.createObjectURL(file)}
                    width={64}
                    height={64}
                    alt={file.name}
                    className="object-cover"
                  />
                )}
                {isImage && isUploaded && (
                  <Image
                    src={uploadedFiles[index].url}
                    width={64}
                    height={64}
                    alt={file.name}
                    className="object-cover"
                  />
                )}
                {!isImage && (
                  <ImageKit
                    src={isImage ? "" : "/images/file-placeholder.png"}
                    width={64}
                    height={64}
                    alt={file.type}
                    className="object-contain"
                  />
                )}
              </div>

              <div className="flex-grow md:flex-grow-0">
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {file.type}
                </div>

                {!isUploaded && (
                  <div className="w-full mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-blue-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* 上传状态提示 */}
                {isUploading && (
                  <div className="text-xs text-blue-500 mt-1">上传中...</div>
                )}
              </div>

              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 mt-2 md:mt-0"
              >
                <ImageKit
                  src="/images/delete.png"
                  width={16}
                  height={16}
                  alt="删除"
                  loading="lazy"
                />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  useEffect(() => {
    return () => {
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  return (
    <div className="p-4 bg-white/50 rounded-lg flex gap-6 justify-between shadow-md text-sm">
      <div className="ring-2 ring-blue-200 rounded-full overflow-hidden cursor-pointer w-10 h-10">
        <Image
          src={user?.avatar || "/images/default.jpg"}
          width={80}
          height={80}
          alt="avatar"
          loading="lazy"
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <form onSubmit={textAction} className="p-1 flex gap-4 items-center justify-start">
          <textarea
            ref={textAreaRef}
            name="desc"
            cols={30}
            rows={1}
            maxLength={1000}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="w-full bg-transparent p-2 rounded-lg flex-1 outline-none placeholder:text-sm
              placeholder:text-gray-400 scrollbar-hide focus:border-blue-500 focus:ring focus:ring-blue-200
              focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white focus:bg-gray"
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
            <button
              type='submit'
              disabled={isLoading || chunkUploading.some(Boolean)}
              className={`${isLoading || chunkUploading.some(Boolean) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ImageKit
                src={"/images/reply.png"}
                width={24}
                height={24}
                alt={isLoading ? "提交中..." : "发布"}
                loading="lazy"
                className="cursor-pointer object-contain"
              />
            </button>
          </div>
        </form>

        {/* 错误信息 */}
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* 多文件预览 */}
        {renderFilePreviews()}

        <div className="flex items-center justify-start gap-6 mt-3 text-gray-400 px-1 flex-wrap">
          <div className="flex gap-2 items-center text-blue-800 hover:text-blue-500 cursor-pointer"
               onClick={() => {
                 const fileInput = document.getElementById('files');
                 if (fileInput) {
                   fileInput.click();
                 }
               }}>
            <ImageKit
              src="/images/addphoto.png"
              width={24}
              height={24}
              alt="AddMedia"
              loading="lazy"
              className="cursor-pointer object-contain"
            />
            <input
              type="file"
              id="files"
              name="files"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            AddMedia
          </div>
          <div className="flex gap-2 items-center text-green-400 hover:text-green-800 cursor-pointer">
            <ImageKit
              src="/images/addevent.png"
              width={24}
              height={24}
              alt="AddEvent"
              loading="lazy"
              className="cursor-pointer object-contain"
            />
            AddEvent
          </div>
          <div className="flex gap-2 items-center text-purple-400 hover:text-purple-800 cursor-pointer">
            <ImageKit
              src="/images/addpoll.png"
              width={24}
              height={24}
              alt="AddPoll"
              loading="lazy"
              className="cursor-pointer object-contain"
            />
            AddPoll
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;