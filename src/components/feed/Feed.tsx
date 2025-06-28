"use client";
import React, { useState, useEffect } from "react";
import Post from "@/components/feed/Post";

interface FeedProps {
  children?: React.ReactNode;
  userId?: string;
  user?: any;
}

const Feed: React.FC<FeedProps> 
= (props: FeedProps) => {
  const { 
    children,
    userId,
    user
  } = props;
  console.log(userId)
  const [posts, setPosts] = useState([]);
  const [url, setUrl] = useState<string>('');
  const fetchPosts = async () => {
    if (userId) {
      setUrl(`/api/post?userid=${userId}`);
    } else {
      setUrl('/api/post');
    }
    const res = await fetch(url);
    const data = await res.json();
    console.log(data?.posts)
    setPosts(data.posts);
  }
  useEffect(() => {
    fetchPosts();
  }, [url])

  return (
    <React.Fragment>
      <div className="
        p-4 bg-white/50 shadow-md rounded-lg flex
        flex-col gap-12 mb-4
      ">
        {
          posts.length === 0 ?
          (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-gray-50/50 rounded-xl shadow-sm">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" 
                strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 
                  8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 
                  002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">There is no post yet.</h3>
              <p className="text-gray-500 max-w-md">
                Share your first post to see it here.
              </p>
            </div>
          ) : (
            posts.map(item => {
              return (
                <Post
                  key={item["id"]}
                  postinfo={item}
                  user={user}
                />
              )
            })
          )
        }
        {children}
      </div>
    </React.Fragment>
  );
}

export default Feed;