import prisma from "@/lib-server/prisma";
import ApiError from "@/lib-server/error";
import {
  TambonsCreateData,
  TambonsGetData,
  TambonsUpdateData,
} from "@/types/models";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import { Prisma, Tambons } from "@prisma/client";

export const getTambon = async (id: number): Promise<Tambons> => {
  const tambons = await prisma.tambons.findUnique({
    where: { id },
  });

  if (!tambons) throw new ApiError(`Tambons with id: ${id} not found.`, 404);

  return tambons;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getTambons = async (
  tambonssGetData: TambonsGetData = {}
): Promise<PaginatedResponse<Tambons>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection,
    amphureId,
  } = tambonssGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.TambonsWhereInput = {};

  if (search) {
    where.name_th = { contains: search };
  }

  if (amphureId) {
    where.amphure_id = { equals: amphureId };
  }

  const totalCount = await prisma.tambons.count({ where });

  let tambonss = await prisma.tambons.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  tambonss = Array.isArray(tambonss) ? tambonss : [];

  const result = {
    items: tambonss.map((tambons) => tambons),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + tambonss.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createTambons = async (
  tambonsCreateData: TambonsCreateData
): Promise<Tambons> => {
  const tambons = await prisma.tambons.create({
    data: {
      ...tambonsCreateData,
    },
  });

  if (!tambons) throw new ApiError("Tambons not created.", 400);

  // convert Tambons to TambonsWithAuthor
  const tambonsWithAuthor = await prisma.tambons.findUnique({
    where: {
      id: tambons.id,
    },
  });

  if (!tambonsWithAuthor) throw new ApiError("Create category failed.", 400);

  return tambonsWithAuthor;
};

export const updateTambons = async (
  id: number,
  tambonsUpdateData: TambonsUpdateData
): Promise<Tambons> => {
  const { name_en, name_th, amphure_id, zip_code } = tambonsUpdateData;

  const _tambons = await prisma.tambons.findUnique({ where: { id } });
  if (!_tambons) throw new ApiError(`Tambons with id: ${id} not found.`, 404);

  const data = {
    ...(name_en && { name_en }),
    ...(name_th && { name_th }),
    ...(amphure_id && { amphure_id }),
    ...(zip_code && { zip_code }),
  };

  const tambons = await prisma.tambons.update({
    where: { id },
    data,
  });

  if (!tambons) throw new ApiError("Update category failed.", 400);

  return tambons;
};

export const deleteTambons = async (id: number): Promise<Tambons> => {
  const _tambons = await prisma.tambons.findUnique({ where: { id } });
  if (!_tambons) throw new ApiError(`Tambons with id: ${id} not found.`, 404);

  const tambons = await prisma.tambons.delete({
    where: { id },
  });

  if (!tambons) throw new ApiError("Delete category failed.", 400);

  return tambons;
};
