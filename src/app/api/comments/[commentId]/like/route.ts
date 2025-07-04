import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/client';
import { auth } from '@clerk/nextjs/server';

// 点赞/取消点赞评论
export async function POST(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const commentId = parseInt((await params).commentId);

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        commentId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          commentId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: '操作失败', details: error.message },
      { status: 500 }
    );
  }
}