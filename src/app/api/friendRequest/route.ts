import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/client";

const getRequestDellows = async (userId: string) => {
  const result = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    }
  })
  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: '缺少必要参数 userId' }, { status: 400 });
  }
  try {
    const result = await getRequestDellows(userId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
