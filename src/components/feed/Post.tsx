'use client';
import React from "react";;
import PostUser from "@/components/PostUser";
import PostDesc from "@/components/PostDesc";
import PostInterItem from "@/components/PostInterItem";
import Comments from "@/components/feed/Comments";
import InterConfig from "@/components/configs/InterConfig";

interface PostProps {
  children?: React.ReactNode;
  userId?: string;
  postinfo?: any;
  user?: any;
}

const Post: React.FC<PostProps> 
= (props: PostProps) => {
  const { children, postinfo, user } = props;
  return (
    <React.Fragment>
      <div 
        className="flex flex-col gap-4 shadow-md p-4 rounded-lg"
      >
        {/* user part */}
        <PostUser 
          username={postinfo["user"]["username"]} 
          src={postinfo["user"]["avatar"]}
        />

        {/* DESC part */}
        <PostDesc 
          username={postinfo["user"]["username"]} 
          content={postinfo["desc"]} 
          image_src={postinfo["image"]}
          audio_src={postinfo["audio"]}
          video_src={postinfo["video"]}
        />

        {/* interactions */}
        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex gap-8 items-center justify-center">
            <PostInterItem {...InterConfig[0]} />
            <PostInterItem {...InterConfig[1]} />
          </div>
          <PostInterItem {...InterConfig[2]} />
        </div>
        
        {/* comments textarea */}
        <Comments user={user} />
      </div>
      {children}
    </React.Fragment>
  )
}

export default Post;