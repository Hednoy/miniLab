import prisma from "@/lib-server/prisma";
import ApiError from "@/lib-server/error";
import {
  ProvincesCreateData,
  ProvincesGetData,
  ProvincesUpdateData,
} from "@/types/models";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import { Prisma, Provinces } from "@prisma/client";

export const getProvince = async (id: number): Promise<Provinces> => {
  const provinces = await prisma.provinces.findUnique({
    where: { id },
  });

  if (!provinces)
    throw new ApiError(`Provinces with id: ${id} not found.`, 404);

  return provinces;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getProvinces = async (
  provincesGetData: ProvincesGetData = {}
): Promise<PaginatedResponse<Provinces>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection,
  } = provincesGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.ProvincesWhereInput = {};

  if (search) {
    where.name_th = { contains: search };
  }

  const totalCount = await prisma.provinces.count({ where });

  let provinces = await prisma.provinces.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  provinces = Array.isArray(provinces) ? provinces : [];

  const result = {
    items: provinces.map((provinces) => provinces),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + provinces.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createProvinces = async (
  serviceCreateData: ProvincesCreateData
): Promise<Provinces> => {
  const provinces = await prisma.provinces.create({
    data: {
      ...serviceCreateData,
    },
  });

  if (!provinces) throw new ApiError("Provinces not created.", 400);

  // convert Provinces to ProvincesWithAuthor
  const serviceWithAuthor = await prisma.provinces.findUnique({
    where: {
      id: provinces.id,
    },
  });

  if (!serviceWithAuthor) throw new ApiError("Create category failed.", 400);

  return serviceWithAuthor;
};

export const updateProvinces = async (
  id: number,
  serviceUpdateData: ProvincesUpdateData
): Promise<Provinces> => {
  const { name_en, name_th } = serviceUpdateData;

  const _service = await prisma.provinces.findUnique({ where: { id } });
  if (!_service) throw new ApiError(`Provinces with id: ${id} not found.`, 404);

  const data = {
    ...(name_en && { name_en }),
    ...(name_th && { name_th }),
  };

  const provinces = await prisma.provinces.update({
    where: { id },
    data,
  });

  if (!provinces) throw new ApiError("Update category failed.", 400);

  return provinces;
};

export const deleteProvinces = async (id: number): Promise<Provinces> => {
  const _service = await prisma.provinces.findUnique({ where: { id } });
  if (!_service) throw new ApiError(`Provinces with id: ${id} not found.`, 404);

  const provinces = await prisma.provinces.delete({
    where: { id },
  });

  if (!provinces) throw new ApiError("Delete category failed.", 400);

  return provinces;
};
