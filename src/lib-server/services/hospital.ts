import { Hospital, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  HospitalCreateFormData,
  HospitalUpdateData,
  HospitalsGetData,
} from "@/types/models/Hospital";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import prisma from "@/lib-server/prisma";

export const getHospital = async (id: number): Promise<Hospital> => {
  const hospital = await prisma.hospital.findUnique({
    where: { id },
    include: {
      Lab: true,
      Patient: true,
    },
  });
  if (!hospital) throw new ApiError(`Hospital with id: ${id} not found.`, 404);

  return hospital;
};

export const getHospitalList = async (
  hospitalGetData: HospitalsGetData = {}
): Promise<PaginatedResponse<Hospital>> => {
  const {
    page = 1,
    limit = 999,
    sort = "updated_at",
    searchTerm,
    sortDirection,
  } = hospitalGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.HospitalWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.hospital.count({ where });

  let hospitals = await prisma.hospital.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      Lab: true,
      Patient: true,
    },
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  hospitals = Array.isArray(hospitals) ? hospitals : [];

  const result = {
    items: hospitals.map((hospitals) => hospitals),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + hospitals.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createHospital = async (
  data: HospitalCreateFormData
): Promise<Hospital> => {
  const hospital = await prisma.hospital.create({
    data: {
      ...data,
    },
  });

  return hospital;
};

export const updateHospital = async (
  id: number,
  data: HospitalUpdateData
): Promise<Hospital> => {
  const hospital = await prisma.hospital.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return hospital;
};

export const deleteHospital = async (id: number): Promise<Hospital> => {
  const hospital = await prisma.hospital.delete({ where: { id } });

  return hospital;
};
