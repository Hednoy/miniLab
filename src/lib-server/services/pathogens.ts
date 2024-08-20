import prisma from "@/lib-server/prisma";
import { Prisma, Pathogens } from "@prisma/client";
import ApiError from "../error";
import {
  PathogensCreateFormData,
  PathogenssGetData,
  PathogensUpdateData,
} from "@/types/models/Pathogens";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getPathogens = async (id: number): Promise<Pathogens> => {
  const where = {} as any;
  if (id) {
    where.id = id;
  }
  // PathogensTestType as test_type_id : number[] (id)
  const pathogens = await prisma.pathogens.findUnique({
    where: where,
    include: { PathogensTestType: { select: { test_type_id: true } } },
  });

  if (!pathogens) {
    throw new ApiError(`Pathogens with id: ${id} not found.`, 404);
  }

  const result = {
    ...pathogens,
    test_type_id:
      pathogens.PathogensTestType.map((testType) => testType.test_type_id) ||
      [],
    PathogensTestType: undefined,
  };

  return result;
};

export const getPathogensByTestTypeId = async (
  id: number
): Promise<Pathogens[]> => {
  const pathogens = await prisma.pathogens.findMany({
    where: {
      PathogensTestType: { some: { test_type_id: id } },
    },
  });
  if (!pathogens)
    throw new ApiError(`Pathogens with id: ${id} not found.`, 404);

  return pathogens;
};

export const getPathogensList = async (
  pathogensGetdata: PathogenssGetData = {}
): Promise<PaginatedResponse<Pathogens>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = pathogensGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.PathogensWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.pathogens.count({ where });

  let pathogenss = await prisma.pathogens.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  pathogenss = Array.isArray(pathogenss) ? pathogenss : [];

  const result = {
    items: pathogenss.map((pathogenss) => pathogenss),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + pathogenss.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createPathogens = async (data: any): Promise<Pathogens> => {
  const testTypeIds = data.test_type_id;
  data.test_type_id = undefined;
  const pathogens = await prisma.pathogens.create({
    data,
  });

  testTypeIds.forEach(async (testType: number) => {
    const payload = {
      ...data,
      pathogens_id: pathogens.id,
      test_type_id: testType,
    } as any;
    await prisma.pathogensTestType.create({ data: payload });
  });

  return pathogens;
};

export const updatePathogens = async (
  id: number,
  data: any
): Promise<Pathogens> => {
  const testTypeIds = data.test_type_id;
  data.test_type_id = undefined;
  const pathogens = await prisma.pathogens.update({
    where: { id },
    data,
  });

  const pathogensTestType = await prisma.pathogensTestType.findMany({
    where: { pathogens_id: id },
  });
  testTypeIds.forEach(async (testType: number) => {
    //check if test type already exists
    const testTypeExists = pathogensTestType.find(
      (item) => item.test_type_id == testType
    );
    //if not exists create new
    if (!testTypeExists) {
      data.machine_id = undefined;
      const payload = {
        ...data,
        pathogens_id: pathogens.id,
        test_type_id: testType,
      };
      await prisma.pathogensTestType.create({ data: payload });
    }
  });

  //delete test type if not exists in new data
  pathogensTestType.forEach(async (item) => {
    const testTypeExists = testTypeIds.find(
      (testType: number) => testType === item.test_type_id
    );
    if (!testTypeExists) {
      await prisma.pathogensTestType.delete({ where: { id: item.id } });
    }
  });

  return pathogens;
};

export const deletePathogens = async (id: number): Promise<Pathogens> => {
  await prisma.pathogensTestType.deleteMany({
    where: { pathogens_id: id },
  });
  const pathogens = await prisma.pathogens.delete({ where: { id } });
  return pathogens;
};
