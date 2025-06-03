"use client"
import React, { useState } from "react";
import Post from "@/components/Post";

interface FeedProps {
  children?: React.ReactNode;
  userId?: string;
}

const Feed: React.FC<FeedProps> 
= (props: FeedProps) => {
  const { 
    children,
    userId 
  } = props;
  const arr = Array.from({length: 10}).fill(0)

  return (
    <React.Fragment>
      <div className="
        p-4 bg-white/50 shadow-md rounded-lg flex
        flex-col gap-12 mb-4
      ">
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        {children}
      </div>
    </React.Fragment>
  );
}

export default Feed;