import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/client';
import { auth } from '@clerk/nextjs/server';
import {base64ToString, stringToBase64} from "@/utils/transformContent";

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { userId } = await auth();
    const postId = parseInt(params.postId);

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true,
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedComments = comments.map(comment => ({
      ...comment,
      content: base64ToString(comment.content),
      likesCount: comment.likes.length,
      isLiked: userId ? comment.likes.some(like => like.userId === userId) : false,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        avatar: comment.user.avatar,
      },
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error: any) {
    return NextResponse.json(
      { error: '获取评论失败', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const postId = parseInt(params.postId);
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: '评论内容不能为空' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: stringToBase64(content),
        userId,
        postId,
      },
      include: {
        user: true,
        likes: true,
      },
    });

    // 更新帖子的评论计数
    await prisma.post.update({
      where: { id: postId },
      data: {
        comments: { connect: { id: comment.id } },
      },
    });

    return NextResponse.json({
      comment: {
        ...comment,
        content: base64ToString(comment.content),
        likesCount: 0,
        isLiked: false,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          avatar: comment.user.avatar,
        },
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: '创建评论失败', details: error.message },
      { status: 500 }
    );
  }
}