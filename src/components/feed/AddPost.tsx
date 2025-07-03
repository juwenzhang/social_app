"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Image as ImageKit } from '@imagekit/next';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { UploadSingleLargeFileToServer } from '@/utils/uploadFile';

interface AddPostProps {
  children?: React.ReactNode;
  userId?: string;
  user?: any;
  type?: string;
}

interface UploadedFile {
  url: string;
  type: string;
  progress: number;
  isUploading: boolean;
  error?: string;
  file: File;
  fileId: string;
}

const AddPost: React.FC<AddPostProps> = (props) => {
  const { user } = props;
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textValue, setTextValue] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter 提交评论
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      return;
    }

    // 单独Enter键插入换行
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = textAreaRef.current?.selectionStart || 0;
      const end = textAreaRef.current?.selectionEnd || 0;

      // 插入换行符
      setTextValue(prev =>
        prev.substring(0, start) + '\n' + prev.substring(end)
      );

      // 移动光标到换行后
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + 1;
          textAreaRef.current.selectionEnd = start + 1;
        }
      }, 0);
      return;
    }

    // 支持Tab键缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textAreaRef.current?.selectionStart || 0;
      const end = textAreaRef.current?.selectionEnd || 0;

      // 插入Tab字符
      setTextValue(prev =>
        prev.substring(0, start) + '  ' + prev.substring(end)
      );

      // 移动光标到Tab后
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + 2;
          textAreaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }
  }, [setTextValue]);

  const textAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const content = formData.get('desc') as string;

      if (!content.trim() && uploadFiles.length === 0) {
        setErrorMessage("内容和文件至少填一项");
        setIsLoading(false);
        return;
      }

      const largeFiles = uploadFiles.filter(file => file.file.size > 100 * 1024 * 1024);
      if (largeFiles.length > 0) {
        setErrorMessage(`文件大小超出限制：${largeFiles[0].file.name}（最大支持100MB）`);
        setIsLoading(false);
        return;
      }

      const validFiles = uploadFiles.filter(file => !file.error);

      const pendingFiles = validFiles.filter(file => file.isUploading || file.progress < 100);
      if (pendingFiles.length > 0) {
        throw new Error("请等待所有文件上传完成");
      }

      validFiles.forEach((file, index) => {
        formData.append(`fileUrl_${index}`, file.url);
        formData.append(`fileType_${index}`, file.type);
      });
      formData.append('fileCount', validFiles.length.toString());

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

  const uploadFileWithChunks = async (file: File, index: number, fileId: string) => {
    setUploadFiles(prev =>
      prev.map((f, i) => i === index ? { ...f, isUploading: true, fileId } : f)
    );

    try {
      const result = await UploadSingleLargeFileToServer(file, 'social_app', (progress: number) => {
        setUploadFiles(prev =>
          prev.map((f, i) => i === index ? { ...f, progress } : f)
        );
      }, fileId);

      // console.log(result);
      if (!result || !result.url) {
        throw new Error("上传文件到服务器时出错");
      }

      setUploadFiles(prev =>
        prev.map((f, i) => i === index ? {
          ...f,
          url: result.url,
          isUploading: false,
          progress: 100
        } : f)
      );

      return {
        url: result.secure_url,
        type: file.type
      };
    } catch (error: any) {
      setUploadFiles(prev =>
        prev.map((f, i) => i === index ? {
          ...f,
          isUploading: false,
          error: error.message || "上传失败"
        } : f)
      );
      throw error;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    if (uploadFiles.length + selectedFiles.length > 32) {
      setErrorMessage("最多只能上传32个文件");
      return;
    }

    const largeFiles = selectedFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setErrorMessage(`文件大小超出限制：${largeFiles[0].name}（最大支持100MB）`);
      return;
    }

    const newFiles = selectedFiles.map(file => ({
      url: '',
      type: file.type,
      progress: 0,
      isUploading: false,
      error: undefined,
      file,
      fileId: crypto.randomUUID()
    }));

    const baseIndex = uploadFiles.length;
    setUploadFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((file, index) => {
      const fileIndex = baseIndex + index;
      uploadFileWithChunks(file.file, fileIndex, file.fileId);
    });
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderFilePreviews = () => {
    if (uploadFiles.length === 0) return null;

    return (
      <div className="mt-3 space-y-3">
        {uploadFiles.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          const isUploaded = file.url && file.progress === 100;
          const showProgress = file.isUploading || (file.progress > 0 && file.progress < 100);

          return (
            <div key={index} className="bg-gray-50 p-3 rounded-lg flex flex-col md:flex-row items-start
              md:items-center gap-3 transition-all duration-300">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden
                bg-gray-200 flex items-center justify-center relative">
                {isImage && (
                  <Image
                    src={isUploaded ? file.url : URL.createObjectURL(file.file)}
                    width={64}
                    height={64}
                    alt={file.file.name}
                    className="object-cover"
                    priority={false}
                  />
                )}
                {isVideo && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <ImageKit
                      src="/images/video_placeholder.png"
                      width={64}
                      height={64}
                      alt="Video placeholder"
                      className="object-contain"
                    />
                    {isUploaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                )}

                {/* 上传进度覆盖层 */}
                {showProgress && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{file.progress}%</span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{file.file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)} • {file.type}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
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

                {/* 进度条 */}
                {showProgress && (
                  <div className="w-full mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-blue-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* 上传状态提示 */}
                {file.error && (
                  <div className="text-xs text-red-500 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {file.error}
                  </div>
                )}
              </div>
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
      uploadFiles.forEach(file => {
        if (file.file) {
          const url = URL.createObjectURL(file.file);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [uploadFiles]);

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
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
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
              disabled={isLoading || uploadFiles.some(file => file.isUploading)}
              className={`${isLoading || uploadFiles.some(file => file.isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
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