import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPost, getAllPosts } from '@/libs/postService';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { stringToBase64, base64ToString } from '@/utils/transformContent';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: '未认证用户' }), { status: 401 });
  }
  const formData = await req.formData();
  const desc = formData.get('desc') as string;
  const image = formData.get('image') as File;
  const audio = formData.get('audio') as File;
  const video = formData.get('video') as File;

  if (!desc) {
    return new NextResponse(JSON.stringify({ error: '描述不能为空' }), { status: 400 });
  }
  let imageUrl;
  if (image) {
    try {
      imageUrl = await uploadToCloudinary(image, 'social_app');
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: '图片上传失败' }), { status: 500 });
    }
  }
  let audioUrl;
  if (audio) {
    try {
      audioUrl = await uploadToCloudinary(audio, 'social_app');
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: '音频上传失败' }), { status: 500 });
    }
  }
  let videoUrl;
  if (video) {
    try {
      videoUrl = await uploadToCloudinary(video, 'social_app');
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: '视频上传失败' }), { status: 500 });
    }
  }
  const post = await createPost(
    userId,
    stringToBase64(desc),
    (imageUrl as any)?.secure_url,
    (audioUrl as any)?.secure_url,
    (videoUrl as any)?.secure_url,
  );
  return new NextResponse(JSON.stringify(post), { status: 201 });
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    const postsWithDesc = posts.map(post => ({
      ...post,
      desc: typeof post.desc === 'string' ? 
        post.desc 
        : base64ToString((post as any).desc),
    }));
    return new NextResponse(JSON.stringify(postsWithDesc), { status: 200 });
  } catch (error) {
    console.error('获取帖子失败:', error);
    return new NextResponse(JSON.stringify({ error: '获取帖子失败' }), { status: 500 });
  }
}