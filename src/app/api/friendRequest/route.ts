import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/client";

const getRequestDellows = async (userId: string, offset: number, limit: number) => {
  const result = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
    take: Number(limit),
    skip: Number(offset),
  })
  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  let offset = searchParams.get('offset');
  let limit = searchParams.get('limit');
  if (!offset || !limit) {
    offset = '0';
    limit = '3';
  }
  if (!userId) {
    return NextResponse.json({ error: '缺少必要参数 userId' }, { status: 400 });
  }
  try {
    const result = await getRequestDellows(
      userId, 
      Number(offset), 
      Number(limit)
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
