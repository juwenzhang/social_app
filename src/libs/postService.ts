import prisma from "@/libs/client";
import { toast } from '@/contexts/provider/ToastSsrProvider';

export const createPost = async (
  userId: string,
  desc: string,
  audio?: string,
  image?: string,
  video?: string,
) => {
  try {
    const result = await prisma.post.create({
      data: {
        userId: userId,
        audio: audio,
        image: image,
        video: video,
        desc: desc
      }
    });
    toast.success("add post successfully");
    return result;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("add post error" + error.message);
    }
    throw error;
  }
};