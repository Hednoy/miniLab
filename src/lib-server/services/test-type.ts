import prisma from "@/lib-server/prisma";
import { Prisma, TestType } from "@prisma/client";
import ApiError from "../error";
import {
  TestTypeCreateFormData,
  TestTypeForDD,
  TestTypeUpdateData,
  TestTypesGetData,
} from "@/types/models/TestType";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getTestType = async (id: number): Promise<TestType> => {
  const testType = await prisma.testType.findUnique({ where: { id } });
  if (!testType) throw new ApiError(`TestType with id: ${id} not found.`, 404);

  return testType;
};

export const getTestTypeList = async (
  testTypeGetdata: TestTypesGetData = {}
): Promise<PaginatedResponse<TestType>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = testTypeGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.TestTypeWhereInput = {};

  if (search) {
    where.prefix_name = { contains: search };
  }

  const totalCount = await prisma.testType.count({ where });

  let testTypes = await prisma.testType.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  testTypes = Array.isArray(testTypes) ? testTypes : [];

  const result = {
    items: testTypes.map((testTypes) => testTypes),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + testTypes.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createTestType = async (
  testTypeData: TestTypeCreateFormData
): Promise<TestType> => {
  const testType = await prisma.testType.create({ data: testTypeData });

  return testType;
};

export const updateTestType = async (
  id: number,
  testTypeData: TestTypeUpdateData
): Promise<TestType> => {
  const testType = await prisma.testType.update({
    where: { id },
    data: testTypeData,
  });

  return testType;
};

export const deleteTestType = async (id: number): Promise<TestType> => {
  const testType = await prisma.testType.delete({ where: { id } });

  return testType;
};

export const getTestTypeForDD = async (): Promise<TestTypeForDD[]> => {
  const testTypes = await prisma.testType.findMany();
  if (testTypes.length === 0) return [];

  return testTypes.map((testType) => ({
    id: testType.id,
    name: testType.subfix_name + " " + testType.prefix_name,
  }));
};
