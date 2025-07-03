'use client';
import React from "react";
import PostDesc from "@/components/PostDesc";
import Comments from "@/components/feed/Comments";
// import PostUser from "@/components/PostUser";
import InterConfig from "@/components/configs/InterConfig";
import PostInterItem from "@/components/PostInterItem";

interface PostProps {
  children?: React.ReactNode;
  postinfo?: any;
  user?: any;
}

const Post: React.FC<PostProps> = (props: PostProps) => {
  const { postinfo, user } = props;

  // 提取文件URL和类型
  const fileUrls = postinfo?.fileUrls || '';
  const fileTypes = postinfo?.fileTypes || '';

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 shadow-md p-4 rounded-lg">
        {/*<PostUser*/}
        {/*  username={postinfo["user"]["username"]}*/}
        {/*  src={postinfo["user"]["avatar"]}*/}
        {/*/>*/}

        <PostDesc
          username={postinfo?.user?.username || '未知用户'}
          avatarUrl={postinfo?.user?.avatar || ''}
          desc={postinfo?.desc || ''}
          fileUrls={fileUrls}
          fileTypes={fileTypes}
          createdAt={postinfo?.createdAt}
        />

        {/* 互动按钮 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-8 items-center justify-center">
            <PostInterItem {...InterConfig[0]} />
            <PostInterItem {...InterConfig[1]} />
          </div>
          <PostInterItem {...InterConfig[2]} />
        </div>

        <Comments postId={postinfo?.id} />
      </div>
    </React.Fragment>
  );
};

export default Post;