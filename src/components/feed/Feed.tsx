"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Post from "@/components/feed/Post";
import LoadingIndicator from "@/components/LoadingIndicator";

interface FeedProps {
  children?: React.ReactNode;
  userId?: string;
  user?: any;
  perPage?: number;
}

const Feed: React.FC<FeedProps> = (props: FeedProps) => {
  const { children, userId, user, perPage = 10 } = props;
  const [posts, setPosts] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(page); // TODO: fix: useStae ==> useRef, fix auto load more source question

  const fetchPosts = useCallback(async (pageNum: number = 1) => {
    if (isLoading || pageNum > totalPages) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      params.append('page', pageNum.toString());
      params.append('perPage', perPage.toString());
      const res = await fetch(`/api/post?${params.toString()}`);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.posts) {
        setPosts((prev:any) => 
          pageNum === 1 ? data.posts : [...prev, ...data.posts]
        );
        setPage(pageNum);
        pageRef.current = pageNum; // 更新 ref
        setTotalPages(data.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.message || '获取帖子数据失败');
    } finally {
      setIsLoading(false);
    }
  }, [userId, perPage, isLoading, totalPages]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    fetchPosts(1);
  }, [userId, perPage]); 

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async entry => {
        if (entry.isIntersecting && !isLoading && pageRef.current < totalPages) {
          await fetchPosts(pageRef.current + 1);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px 500px 0px'
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchPosts, totalPages, isLoading]);

  return (
    <React.Fragment>
      <div className="p-4 bg-white/50 shadow-md rounded-lg flex flex-col gap-12 mb-4">
        {error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-lg text-center">
            <p>⚠️ {error}</p>
            <button 
              onClick={() => fetchPosts(pageRef.current + 1)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Load More
            </button>
          </div>
        ) : posts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 
          bg-gray-50/50 rounded-xl shadow-md">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" 
                strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 
                  8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 
                  002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              There is no post.
            </h3>
            <p className="text-gray-500 max-w-md">
              Share Your Posts.
            </p>
          </div>
        ) : (
          <>
            {posts.map((item: any) => (
              <Post
                key={item["id"]}
                postinfo={item}
                user={user}
              />
            ))}
            
            <div 
              ref={observerRef} 
              className="py-4 text-center cursor-pointer"
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : page < totalPages ? (
                <button
                  onClick={() => fetchPosts(pageRef.current + 1)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Load More
                </button> 
              ) : (
                <p className="text-gray-500">
                  No more posts.
                </p>
              )}
            </div>
          </>
        )}
        {children}
      </div>
    </React.Fragment>
  );
};

export default Feed;