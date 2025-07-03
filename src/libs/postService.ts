import prisma from "@/libs/client";

export const createPost = async (
  userId: string,
  desc: string,
  fileUrls?: string[],
  fileTypes?: string[],
) => {
  try {
    return await prisma.post.create({
      data: {
        userId: userId,
        fileUrls: fileUrls?.join(';'),
        fileTypes: fileTypes?.join(';'),
        desc: desc
      }
    });
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
