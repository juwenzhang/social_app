import prisma from "@/libs/client";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export async function POST(req: Request) {
  const id = req.url.split('/').pop() as string;
  const formData = await req.formData();
  const updateData: Record<string, any> = {};

  // 处理普通文本字段
  [
    'description', 
    'school', 
    'github_name', 
    'github_link', 
    'juejin_name', 
    'juejin_link', 
    'enterprise'
  ].forEach(field => {
    const value = formData.get(field);
    if (value && typeof value === 'string') {
      updateData[field] = value;
    }
  });

  // 处理图片上传
  const coverFile = formData.get('cover') as File | null;
  if (coverFile) {
    try {
      const imageUploadResult = await uploadToCloudinary(
        coverFile,
        'social_app', 
      );
      updateData.cover = (imageUploadResult as any).secure_url; 
    } catch (error) {
      console.error('图片上传失败：', error);
      return new NextResponse(JSON.stringify({ error: '图片上传失败' }), { status: 500 });
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.redirect(new URL(`/profile/${updatedUser.id}`, req.url), 302);
  } catch (error) {
    console.error('用户信息更新失败：', error);
    return new NextResponse(JSON.stringify({ error: '用户信息更新失败' }), { status: 500 });
  }
}