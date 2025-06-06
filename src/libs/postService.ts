import prisma from "@/libs/client";

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
    return result;
  } catch (error) {
    throw error;
  }
};

