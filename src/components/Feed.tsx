import React from "react";
import Post from "@/components/Post";

interface FeedProps {
  children?: React.ReactNode;
}

const Feed: React.FC<FeedProps> 
= (props: FeedProps) => {
  const { children } = props;

  return (
    <React.Fragment>
      <div className="
        p-4 bg-white shadow-md rounded-lg flex
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