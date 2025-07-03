import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPost } from '@/libs/postService';
import { stringToBase64 } from '@/utils/transformContent';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: '未认证用户' }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const desc = formData.get('desc') as string;
    const fileCount = parseInt(formData.get('fileCount') as string || '0');

    if (!desc?.trim() && fileCount === 0) {
      return new NextResponse(JSON.stringify({ error: '描述和文件至少填一项' }), { status: 400 });
    }

    const fileUrls: string[] = [];
    const fileTypes: string[] = [];

    for (let i = 0; i < fileCount; i++) {
      const fileUrl = formData.get(`fileUrl_${i}`) as string;
      const fileType = formData.get(`fileType_${i}`) as string;

      if (fileUrl) {
        fileUrls.push(fileUrl);
        fileTypes.push(fileType);
      }
    }

    if (fileCount > 0 && fileUrls.length === 0) {
      return new NextResponse(JSON.stringify({ error: '未找到上传的文件URL' }), { status: 400 });
    }

    const post = await createPost(
      userId,
      stringToBase64(desc),
      fileUrls,
      fileTypes
    );

    return new Response(JSON.stringify({
      success: true,
      message: '帖子创建成功',
      postId: post.id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || '创建帖子失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

