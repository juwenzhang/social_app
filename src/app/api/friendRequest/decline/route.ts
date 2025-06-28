import prisma from "@/libs/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('receiverId');
    if (!id) {
      return NextResponse.json({ error: 'Missing receiverId' }, { status: 400 });
    }
    // console.log('id', id);
    const existingFriendRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: id,
        receiverId: userId,
      },
    });
    // console.log(existingFriendRequest)
    if (existingFriendRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFriendRequest.id,
        }
      })
      return NextResponse.json({ message: 'Friend request accepted' });
    } else {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}