import prisma from "@/libs/client";
import { NextResponse, NextRequest } from "next/server";

interface PaginationParams {
  page: number;
  perPage: number;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
type AllowedSortFields = 'createdAt' | 'updatedAt' | 'id';

const getSafeSortField = (sortBy: string): AllowedSortFields | 'createdAt' => {
  const allowedFields: AllowedSortFields[] = ['createdAt', 'updatedAt', 'id'];
  return allowedFields.includes(sortBy as AllowedSortFields) 
    ? (sortBy as AllowedSortFields) 
    : 'createdAt'; // 默认排序字段
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const pagination: PaginationParams = {
      page: parseInt(searchParams.get('page') || '') || DEFAULT_PAGE,
      perPage: parseInt(searchParams.get('perPage') || '') || DEFAULT_PER_PAGE,
      userId: searchParams.get('userId') as string,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    };
    
    const skip = (pagination.page - 1) * pagination.perPage;
    
    const where: any = {};
    if (pagination.userId) {
      where.userId = pagination.userId;
    }

    const safeSortBy = getSafeSortField(pagination.sortBy as string);
    
    // 同时获取帖子列表和总数（用于分页）
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: true,
          likes: true,
          comments: true,
        },
        orderBy: {
          [safeSortBy]: pagination.sortOrder
        },
        skip,
        take: pagination.perPage
      }),
      prisma.post.count({ where })
    ]);
    
    const totalPages = Math.ceil(totalCount / pagination.perPage);
    
    return NextResponse.json({
      posts,
      totalPages,
      currentPage: pagination.page,
      perPage: pagination.perPage,
      totalCount
    });
  } catch (err) {
    console.error('获取帖子错误:', err);
    return NextResponse.json(
      { error: '获取帖子数据失败' }, 
      { status: 500 }
    );
  }
}