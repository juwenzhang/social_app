import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPost, getAllPosts } from '@/libs/postService';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { stringToBase64, base64ToString } from '@/utils/transformContent';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: '未认证用户' }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const desc = formData.get('desc') as string;
    const fileCount = parseInt(formData.get('fileCount') as string || '0');

    if (!desc.trim() && fileCount === 0) {
      return new NextResponse(JSON.stringify({ error: '描述和文件至少填一项' }), { status: 400 });
    }

    const files: File[] = [];
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file) files.push(file);
    }

    const invalidFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return (isImage && sizeMB > 5) || (isVideo && sizeMB > 50);
    });

    if (invalidFiles.length > 0) {
      return new NextResponse(JSON.stringify({
        error: `文件大小超出限制：${invalidFiles[0].name}`
      }), { status: 400 });
    }

    const uploadPromises = files.map(file =>
      uploadToCloudinary(file, 'social_app')
    );

    const uploadResults = await Promise.all(uploadPromises);
    const fileUrls = uploadResults.map(result => (result as any)?.secure_url);
    const fileTypes = files.map(file => file.type);

    const post = await createPost(
      userId,
      stringToBase64(desc),
      fileUrls,
      fileTypes
    );

    return new NextResponse(JSON.stringify(post), { status: 201 });
  } catch (error: any) {
    console.error('多文件上传处理失败:', error);
    return new NextResponse(JSON.stringify({
      error: error.message || '服务器错误，请重试'
    }), {
      status: error.response?.status || 500
    });
  }
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
  } catch (error: any) {
    console.error('获取帖子失败:', error);
    return new NextResponse(JSON.stringify({
      error: error.message || '获取帖子失败'
    }), { status: 500 });
  }
}