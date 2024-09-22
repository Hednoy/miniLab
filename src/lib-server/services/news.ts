import prisma from "@/lib-server/prisma";
import { News, NewsType, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  NewsCreateFormData,
  NewsUpdateData,
  NewsUpdateFormData,
  NewssGetData,
} from "@/types/models/News";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import path from "path";
import fs from "fs";
import _ from "lodash";

//
export const getNews = async (id: number): Promise<News> => {
  const news = await prisma.news.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!news) throw new ApiError(`News with id: ${id} not found.`, 404);

  return news;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getNewsList = async (
  newsGetData: NewssGetData = {}
): Promise<PaginatedResponse<News>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = newsGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.NewsWhereInput = {};

  if (search) {
    where.title = { contains: search };
  }

  if (newsGetData?.date) {
    where.date_start = new Date(newsGetData.date);
  }

  if (newsGetData?.new_type_id) {
    where.type_id = newsGetData.new_type_id;
  }

  const totalCount = await prisma.news.count({ where });

  let news = await prisma.news.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      images: true,
    },
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  news = Array.isArray(news) ? news : [];

  const result = {
    items: news.map((news) => news),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + news.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createNews = async (data: NewsCreateFormData): Promise<News> => {
  const news = await prisma.news.create({
    data: {
      title: data.title,
      description: data.description,
      date_end: data.date_end,
      date_start: data.date_start,
      view_count: data.view_count,
      is_active: data.is_active,
      type_id: data.type_id,
    },
  });

  if (!news) throw new ApiError(`News not created.`, 500);

  if (data.images) {
    data.images?.forEach(async (image) => {
      await prisma.newsImages.create({
        data: {
          news_id: news.id,
          file_name: image.file_name,
          file_path: image.file_path,
        },
      });
    });
  }

  return news;
};

export const updateNews = async (
  id: number,
  data: NewsUpdateFormData
): Promise<News> => {
  const _news = await prisma.news.findUnique({ where: { id } });
  if (!_news) throw new ApiError(`News with id: ${id} not found.`, 404);

  const news = await prisma.news.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      date_end: data.date_end,
      date_start: data.date_start,
      view_count: data.view_count,
      is_active: data.is_active,
      type_id: data.type_id,
    },
  });

  if (!news) throw new ApiError(`News with id: ${id} not found.`, 404);

  if (data.images) {
    await prisma.newsImages.deleteMany({ where: { news_id: news.id } });
    data.images?.forEach(async (image) => {
      await prisma.newsImages.create({
        data: {
          news_id: news.id,
          file_name: image.file_name,
          file_path: image.file_path,
        },
      });
    });
  }

  return news;
};

export const deleteNews = async (id: number): Promise<News> => {
  const _news = await prisma.news.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
  if (!_news) throw new ApiError(`News with id: ${id} not found.`, 404);

  const news = await prisma.news.delete({
    where: { id },
  });

  if (!news) throw new ApiError(`News with id: ${id} not found.`, 404);

  // Delete associated images from the file system
  console.log(_news.images);
  if (_news.images) {
    for (const image of _news.images) {
      // สร้างพาธใหม่โดยเริ่มจาก "public" แล้วเพิ่ม file_path ที่ปรับแก้
      const filePath = path.resolve(
        "public",
        image.file_path.replace("/public/", "")
      );

      // console.log(`Generated file path: ${filePath}`);

      try {
        // ตรวจสอบว่าไฟล์มีอยู่จริง
        await fs.promises.access(filePath);
        // ลบไฟล์ออก
        await fs.promises.unlink(filePath);
        console.log(`Successfully deleted file at path: ${filePath}`);
      } catch (err) {
        console.error(`Error caught in try-catch:`, err); // ตรวจสอบ error ที่เกิดขึ้น
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          console.warn(`File not found at path: ${filePath}`);
        } else {
          console.error(`Failed to delete file at path: ${filePath}`, err);
        }
      }
    }
  }

  return news;
};

export const getNewsTypes = async (): Promise<NewsType[]> => {
  const newsTypes = await prisma.newsType.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return newsTypes;
};
