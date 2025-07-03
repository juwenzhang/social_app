import React, { useEffect, useState, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import dart from 'highlight.js/lib/languages/dart';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('dart', dart);

interface PostProps {
  username: string;
  avatarUrl: string;
  desc: string;
  fileUrls: string;
  fileTypes: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  onLike?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
}

function SyntaxHighlightedCode(props: any) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-')) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute('data-highlighted');
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const PostDesc: React.FC<PostProps> = ({
                                            username,
                                            avatarUrl,
                                            desc,
                                            fileUrls,
                                            fileTypes,
                                            createdAt,
                                          }) => {
  const [mediaItems, setMediaItems] = useState<{ url: string; type: string }[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!fileUrls) {
        setMediaItems([]);
        setLoadingMedia(false);
        return;
      }

      const urls = fileUrls.split(';').filter(Boolean);
      const types = fileTypes.split(';').filter(Boolean);

      const items = urls.map((url, index) => ({
        url,
        type: types[index] || 'unknown'
      }));

      setMediaItems(items);
      setLoadingMedia(false);
    } catch (err: any) {
      console.error(err);
      setError('解析媒体文件时出错');
      setLoadingMedia(false);
    }
  }, [fileUrls, fileTypes]);

  const formattedDate = useMemo(() => {
    if (!createdAt) return '';
    return new Date(createdAt).toLocaleDateString('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [createdAt]);

  const renderMediaItems = () => {
    if (loadingMedia) {
      return <div className="p-4 text-center text-gray-500">uploading media...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (mediaItems.length === 0) {
      return null;
    }

    if (mediaItems.length === 1) {
      const item = mediaItems[0];
      return renderSingleMediaItem(item);
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-3 rounded-lg overflow-hidden">
        {mediaItems.map((item, index) => (
          <div key={index} className="aspect-square relative overflow-hidden">
            {renderMediaItemThumbnail(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderSingleMediaItem = (item: { url: string; type: string }) => {
    if (item.type.startsWith('image/')) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden">
          <Image
            src={item.url}
            alt={`${username}发布的图片`}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      );
    }

    if (item.type.startsWith('video/')) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden">
          <video controls className="w-full h-auto">
            <source src={item.url} type={item.type} />
            您的浏览器不支持视频播放
          </video>
        </div>
      );
    }

    return (
      <div className="mt-3 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">不支持的媒体类型: {item.type}</p>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          下载文件
        </a>
      </div>
    );
  };

  const renderMediaItemThumbnail = (item: { url: string; type: string }) => {
    if (item.type.startsWith('image/')) {
      return (
        <Image
          src={item.url}
          alt={`${username}发布的图片`}
          fill
          className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      );
    }

    if (item.type.startsWith('video/')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <Image
            src={item.url}
            alt={`${username}发布的视频`}
            fill
            className="object-cover opacity-50"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <p className="text-xs text-gray-500 text-center px-2">不支持的类型</p>
      </div>
    );
  };

  return (
    <div className="bg-white/50 rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-4 flex items-center">
        <Image
          src={avatarUrl}
          alt={username}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-gray-800 gradient-text">{username}</h3>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <Markdown
            options={{
              overrides: {
                code: SyntaxHighlightedCode,
                a: ({ children, ...props }) => (
                  <a {...props} className="text-blue-600 hover:underline break-all">
                    {children}
                  </a>
                ),
                pre: ({ children, ...props }) => (
                  <pre {...props} className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto break-all">
                    {children}
                  </pre>
                )
              }
            }}
          >
            {desc}
          </Markdown>
        </div>

        {renderMediaItems()}
      </div>
    </div>
  );
};

export default PostDesc;