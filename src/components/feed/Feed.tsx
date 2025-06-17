import React from "react";
import Post from "@/components/feed/Post";

interface FeedProps {
  children?: React.ReactNode;
  user?: string;
}

const Feed: React.FC<FeedProps> 
= async (props: FeedProps) => {
  const { 
    children,
    user
  } = props;
  const arr = Array.from({length: 10}).fill(0)

  return (
    <React.Fragment>
      <div className="
        p-4 bg-white/50 shadow-md rounded-lg flex
        flex-col gap-12 mb-4
      ">
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        <Post user={user} />
        {children}
      </div>
    </React.Fragment>
  );
}

export default Feed;