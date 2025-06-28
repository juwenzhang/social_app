import prisma from "@/libs/client";
import { NextResponse, NextRequest } from "next/server";

const getAllPost = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: true,
    }
  })
  return posts;
}

const getPostByUserId = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      likes: true,
      comments: true,
    }
  })
  return posts;
}

export async function GET(
  req: Request,
) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get('userId');
    if (!userId) {
      const posts = await getAllPost();
      return NextResponse.json({ posts });  
    } else {
      const posts = await getPostByUserId(userId);
      return NextResponse.json({ posts });
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
