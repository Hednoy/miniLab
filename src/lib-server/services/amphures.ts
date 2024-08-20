import prisma from "@/lib-server/prisma";
import ApiError from "@/lib-server/error";
import {
  AmphuresCreateData,
  AmphuresGetData,
  AmphuresUpdateData,
} from "@/types/models";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import { Amphures, Prisma } from "@prisma/client";

export const getAmphure = async (id: number): Promise<Amphures> => {
  const amphures = await prisma.amphures.findUnique({
    where: { id },
  });

  if (!amphures) throw new ApiError(`Amphures with id: ${id} not found.`, 404);

  return amphures;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getAmphures = async (
  amphuressGetData: AmphuresGetData = {}
): Promise<PaginatedResponse<Amphures>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection,
    provinceId,
  } = amphuressGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.AmphuresWhereInput = {};

  if (search) {
    where.name_th = { contains: search };
  }

  if (provinceId) {
    where.AND = { province_id: provinceId };
  }

  console.log("where", where);

  const totalCount = await prisma.amphures.count({ where });

  let amphuress = await prisma.amphures.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  amphuress = Array.isArray(amphuress) ? amphuress : [];

  const result = {
    items: amphuress.map((amphures) => amphures),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + amphuress.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createAmphures = async (
  amphuresCreateData: AmphuresCreateData
): Promise<Amphures> => {
  const amphures = await prisma.amphures.create({
    data: {
      ...amphuresCreateData,
    },
  });

  if (!amphures) throw new ApiError("Amphures not created.", 400);

  // convert Amphures to AmphuresWithAuthor
  const amphuresWithAuthor = await prisma.amphures.findUnique({
    where: {
      id: amphures.id,
    },
  });

  if (!amphuresWithAuthor) throw new ApiError("Create category failed.", 400);

  return amphuresWithAuthor;
};

export const updateAmphures = async (
  id: number,
  amphuresUpdateData: AmphuresUpdateData
): Promise<Amphures> => {
  const { name_en, name_th, province_id } = amphuresUpdateData;

  const _amphures = await prisma.amphures.findUnique({ where: { id } });
  if (!_amphures) throw new ApiError(`Amphures with id: ${id} not found.`, 404);

  const data = {
    ...(name_en && { name_en }),
    ...(name_th && { name_th }),
    ...(province_id && { province_id }),
  };

  const amphures = await prisma.amphures.update({
    where: { id },
    data,
  });

  if (!amphures) throw new ApiError("Update category failed.", 400);

  return amphures;
};

export const deleteAmphures = async (id: number): Promise<Amphures> => {
  const _amphures = await prisma.amphures.findUnique({ where: { id } });
  if (!_amphures) throw new ApiError(`Amphures with id: ${id} not found.`, 404);

  const amphures = await prisma.amphures.delete({
    where: { id },
  });

  if (!amphures) throw new ApiError("Delete category failed.", 400);

  return amphures;
};
