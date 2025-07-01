import React, {
  useEffect, 
  useState, 
  useCallback, 
  useMemo,  
} from 'react';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import hljs from 'highlight.js';
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

interface PostDescProps {
  children?: React.ReactNode;
  image_src?: string;
  audio_src?: string;
  video_src?: string;
  alt?: string;
  title?: string;
  content?: string;
  username?: string;
}

interface WorkerMessage {
  src: string;
  watermarkText: string;
}

interface WorkerSuccessResponse {
  data: Blob;
}

interface WorkerErrorResponse {
  error: string;
}

type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;

function SyntaxHighlightedCode(props: any) {
  const ref = React.useRef<HTMLElement|null>(null)

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-')) {
      hljs.highlightElement(ref.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

const PostDesc: React.FC<PostDescProps> = (props: PostDescProps) => {
  const {
    image_src,
    audio_src,
    video_src,
    alt = 'Image Do Not Load',
    title = 'Image',
    content = 'Content',
    username
  } = props;
  const [watermarkedSrc, setWatermarkedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const watermarkText = username as string;
  const fullImageUrl = useMemo(() => {
    if (!image_src && !audio_src && !video_src) {
      return typeof window !== 'undefined' 
        ? new URL('/images/default.jpg', window.location.origin).toString() 
        : '/images/default.jpg';
    } else {
      if (image_src) {
        return typeof window !== 'undefined' 
          ? new URL(image_src, window.location.origin).toString() 
          : image_src;
      }
      if (audio_src) {
        return typeof window !== 'undefined' 
          ? new URL(audio_src, window.location.origin).toString() 
          : audio_src;
      }
      if (video_src) {
        return typeof window !== 'undefined' 
          ? new URL(video_src, window.location.origin).toString() 
          : video_src;
      }
    }
  }, [image_src]);

  const handleWorkerMessage = useCallback((event: MessageEvent<WorkerResponse>) => {
    if ('error' in event.data) {
      setError(new Error(event.data.error));
      setIsLoading(false);
    } else {
      const url = URL.createObjectURL(event.data.data);
      setWatermarkedSrc(url);
      setIsLoading(false);
    }
  }, []);

  const handleWorkerError = useCallback((errorEvent: ErrorEvent) => {
    setError(new Error(`Web Worker 出错: ${errorEvent.message}`));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const worker = new Worker(
      new URL('../webworkers/imageProcessing.worker.ts', import.meta.url),
    );

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    const message: WorkerMessage = { 
      src: fullImageUrl as string, 
      watermarkText: `${watermarkText ? watermarkText : ""} @jwz_social_app` 
    };
    worker.postMessage(message);
    return () => {
      isMounted = false;
      worker.terminate();
      if (watermarkedSrc) {
        URL.revokeObjectURL(watermarkedSrc);
      }
    };
  }, [fullImageUrl, watermarkText, handleWorkerMessage, handleWorkerError]);

  if (error) {
    return <div>加载图片时出错: {error.message}</div>;
  }

  return (
    <React.Fragment>
      <div className='flex flex-col gap-2 mt-2'>
        <div className='w-full min-h-96 relative'>
          {isLoading ? (
            <div className="loading-container-local">
              <div className="loading-spinner-local"></div>
              <p className="loading-text-local">Loading……</p>
            </div>
          ) : (
            <a
              href={watermarkedSrc || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='block w-full h-full rounded-lg overflow-hidden'
            >
              <Image
                src={(watermarkedSrc || image_src) as string}
                alt={alt}
                fill
                loading='lazy'
                className='w-full h-full object-cover rounded-lg shadow-md'
              />
            </a>
          )}
        </div>
        {/* {content} */}
        <Markdown 
            className='p-2 bg-white/85 rounded-md shadow-md  break-all' break-all
            options={{ 
              forceWrapper: true,
              wrapper: 'article',
              overrides: {
                code: SyntaxHighlightedCode,
                a: (
                   { children, ...props }
                ) => <a {...props} className='break-all'>{children}</a>,
                p: (
                  { children, ...props }
                ) => <p {...props} className='break-all'>{children}</p>,
                pre: (
                  { children, ...props }
                ) => <pre {...props} className='break-all'>{children}</pre>,
                h1: (
                  { children, ...props }
                ) => <h1 {...props} className='break-all'>{children}</h1>,
                h2: (
                  { children, ...props }
                ) => <h2 {...props} className='break-all'>{children}</h2>,
                h3: (
                  { children, ...props }
                ) => <h3 {...props} className='break-all'>{children}</h3>,
                h4: (
                  { children, ...props }
                ) => <h4 {...props} className='break-all'>{children}</h4>,
                h5: (
                  { children, ...props }
                ) => <h5 {...props} className='break-all'>{children}</h5>,
                h6: (
                  { children, ...props }
                ) => <h6 {...props} className='break-all'>{children}</h6>,
                blockquote: (
                  { children, ...props }
                ) => <blockquote {...props} className='break-all'>{children}</blockquote>,
                ul: (
                  { children, ...props }
                ) => <ul {...props} className='break-all'>{children}</ul>,
                li: (
                  { children, ...props }
                ) => <li {...props} className='break-all'>{children}</li>,
                img: (
                  { children, ...props }
                ) => <img {...props} className='break-all' />,
                video: (
                  { children, ...props }
                ) => <video {...props} className='break-all' />,
                table: (
                  { children, ...props }
                ) => <table {...props} className='break-all'>{children}</table>,
              }, 
            }}
        >
          {content}
        </Markdown>
      </div>
    </React.Fragment>
  );
};

export default PostDesc;