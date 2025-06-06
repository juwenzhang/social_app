import prisma from "@/libs/client";

export const createUser = async (
  id: string, 
  username: string,
  avatar: string,
  cover?: string,
  name?: string,
  description?: string,
  enterprise?: string,
  city?: string,
  school?: string,
  github_name?: string,
  github_link?: string,
  juejin_name?: string,
  juejin_link?: string,
) => {
  try {
    const result = await prisma.user.create({
      data: {
        id: id,
        username: username,
        avatar: avatar,
        cover: cover,
        name: name,
        description: description,
        enterprise: enterprise,
        city: city,
        school: school,
        github_name: github_name,
        github_link: github_link,
        juejin_name: juejin_name,
        juejin_link: juejin_link,
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export const getUser = async (id: string) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            likes: true,
            comments: true,
            blocks: true, 
            blocked: true,
            sentRequests: true,
            receivedRequests: true,
            stories: true,
          }
        }
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export const getUserFolowers = async (id: string) => {
  try {
    const result = await prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            followers: true,
          }
        }
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (id: string, data: any) => {
  try {
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export const deleteUser = async (id: string) => {
  try {
    const result = await prisma.user.delete({
      where: {
        id: id,
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}