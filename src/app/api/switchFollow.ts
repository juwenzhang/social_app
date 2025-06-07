import { switchFollow } from "@/libs/useraction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, currentUserId } = await req.json();
        
        if (!userId || !currentUserId) {
            return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
        }

        const res = await switchFollow(userId, currentUserId);
        return NextResponse.json(
          { success: true, message: "关注状态更新成功", data: res }, 
          { status: 200 },
        );
    } catch (error) {
        console.error("更新关注状态时出错:", error);
        return NextResponse.json({ error: '更新关注状态时出错，请稍后重试' }, { status: 500 });
    }
}