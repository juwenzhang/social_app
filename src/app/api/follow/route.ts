import prisma from "@/libs/client";
import { NextRequest, NextResponse } from "next/server";

export const switchFollow = async (userId: string, currentUserId: string) => {
  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      }
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        }
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        }
      });
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          }
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          }
        });
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Error saving user to database:", error);
    return { success: false, error: "Failed to update the user" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, currentUserId } = await req.json();
    if (!userId || !currentUserId) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    const result = await switchFollow(userId, currentUserId);
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ success: false, error: "An error occurred while processing the request" }, { status: 500 });
  }
}