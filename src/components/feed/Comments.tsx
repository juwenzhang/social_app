'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { Image as ImageKit } from '@imagekit/next';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  likesCount: number;
  isLiked: boolean;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/${postId}`);
        if (!response.ok) {
          throw new Error('获取评论失败');
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('提交评论失败');
      }

      const newCommentData = await response.json();
      setComments([newCommentData.comment, ...comments]);
      setNewComment('');
      toast.success('评论成功', { position: 'top-right' });
    } catch (err: any) {
      toast.error(err.message || '提交评论失败', { position: 'top-right' });
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('点赞失败');
      }

      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      }));
    } catch (err: any) {
      toast.error(err.message || '点赞失败', { position: 'top-right' });
    }
  };

  return (
    <div className='mt-4 p-4 bg-white/50 rounded-lg shadow-md'>
      {/* 评论输入框 */}
      <div className='flex items-center gap-4'>
        <Image
          src={user?.imageUrl || '/images/default.jpg'}
          alt={user?.username || '用户头像'}
          width={32}
          height={32}
          loading='lazy'
          className='rounded-full object-cover ring-2 ring-gray-300'
        />
        <form onSubmit={handleSubmitComment} className='flex-1 flex items-center justify-center gap-2'>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="
              w-full bg-gray-100 p-2 rounded-lg flex-1
              outline-none placeholder:text-sm
              placeholder:text-gray-400 resize-none scrollbar-hide
              focus:border-blue-500 focus:ring focus:ring-blue-200
              focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white
            "
            placeholder="write comment here..."
          />
          <button
            type="submit"
            className="px-3 py-1 bg-white-500/50 text-white rounded-lg hover:bg-blue-600/50 transition-colors"
          >
            <ImageKit
              alt={'reply'}
              src={'/images/reply.png'}
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-4 text-center text-gray-500">Comment Loading...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-gray-500">There Is Nothing</div>
      ) : (
        <div className="mt-6 space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
              {/* 评论者头像 */}
              <Image
                src={comment.user.avatar || '/images/default.jpg'}
                alt={comment.user.username || '用户头像'}
                width={32}
                height={32}
                loading='lazy'
                className='w-8 h-8 rounded-full object-cover ring-2 ring-gray-300'
              />

              {/* 评论内容 */}
              <div className='w-[90%] flex flex-col gap-1'>
                {/* 用户名 */}
                <span className='font-semibold text-gray-800'>
                  {comment.user.username}
                </span>

                <p className='break-words text-gray-600 text-sm'>
                  {comment.content}
                </p>

                <div className='flex gap-4 items-center text-xs text-gray-500'>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center ${comment.isLiked ? 'text-red-500' : 'text-gray-500'} cursor-pointer`}
                  >
                    <svg className="w-3 h-3 mr-1" fill={comment.isLiked ? "red" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>{comment.likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;