import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/client";

export const getUser = async (id: string) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            likes: true,
            comments: true,
            blocks: true, 
            blocked: true,
            sentRequests: true,
            receivedRequests: true,
            stories: true,
          }
        }
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const userId = await req.json();
  try {
    const user = await getUser(userId);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}