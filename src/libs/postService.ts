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

export const getAllPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return posts;
  } catch (error) {
    throw error;
  }
}

export const getPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return posts;
  } catch (error) {
    throw error;
  }
}
