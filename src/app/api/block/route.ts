import prisma from "@/libs/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, currentUserId } = await request.json();

    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      }
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        }
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        }
      });
    }

    return NextResponse.json({ message: '操作成功' }, { status: 200 });
  } catch (error) {
    console.error("Error switching block status:", error);
    return NextResponse.json({ message: '操作失败' }, { status: 500 });
  }
}