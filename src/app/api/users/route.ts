import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"
import prisma from "@/libs/client";

const getAllUsers = async (userId: string) => {
  try {
    const result = await prisma.user.findMany({
      where: {
        id: { not: userId }
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

export async function GET() {
  try {
    const { userId } = await auth()
    const users = await getAllUsers(userId as string);
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}