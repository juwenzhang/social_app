import React from "react";;
import PostUser from "@/components/PostUser";
import PostDesc from "@/components/PostDesc";
import PostInterItem from "@/components/PostInterItem";
import Comments from "@/components/Comments";
import InterConfig from "@/components/configs/InterConfig";

interface PostProps {
  children?: React.ReactNode;
}

const Post: React.FC<PostProps> 
= (props: PostProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 shadow-md p-4 rounded-lg">
        {/* user part */}
        <PostUser />

        {/* DESC part */}
        <PostDesc />

        {/* interactions */}
        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex gap-8 items-center justify-center">
            <PostInterItem {...InterConfig[0]} />
            <PostInterItem {...InterConfig[1]} />
          </div>
          <PostInterItem {...InterConfig[2]} />
        </div>
        
        {/* comments textarea */}
        <Comments />
      </div>
      {children}
    </React.Fragment>
  )
}

export default Post;