import prisma from "@/lib-server/prisma";
import { Prisma, InspectionType } from "@prisma/client";
import ApiError from "../error";
import {
  InspectionTypeCreateFormData,
  InspectionTypeUpdateData,
  InspectionTypesGetData,
} from "@/types/models/InspectionType";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getInspectionType = async (
  id: number
): Promise<InspectionType> => {
  const inspectionType = await prisma.inspectionType.findUnique({
    where: { id },
  });
  if (!inspectionType)
    throw new ApiError(`InspectionType with id: ${id} not found.`, 404);

  return inspectionType;
};

export const getInspectionTypeList = async (
  inspectionTypeGetdata: InspectionTypesGetData = {}
): Promise<PaginatedResponse<InspectionType>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = inspectionTypeGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.InspectionTypeWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.inspectionType.count({ where });

  let inspectionTypes = await prisma.inspectionType.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  inspectionTypes = Array.isArray(inspectionTypes) ? inspectionTypes : [];

  const result = {
    items: inspectionTypes.map((inspectionTypes) => inspectionTypes),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + inspectionTypes.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createInspectionType = async (
  inspectionTypeData: InspectionTypeCreateFormData
): Promise<InspectionType> => {
  const inspectionType = await prisma.inspectionType.create({
    data: inspectionTypeData,
  });

  return inspectionType;
};

export const updateInspectionType = async (
  inspectionTypeData: InspectionTypeUpdateData,
  id: number
): Promise<InspectionType> => {
  const inspectionType = await prisma.inspectionType.update({
    where: { id },
    data: inspectionTypeData,
  });

  return inspectionType;
};

export const deleteInspectionType = async (
  id: number
): Promise<InspectionType> => {
  const inspectionType = await prisma.inspectionType.delete({
    where: { id },
  });

  return inspectionType;
};
