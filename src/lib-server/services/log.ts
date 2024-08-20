import prisma from "@/lib-server/prisma";
import { Prisma, OfficerLog } from "@prisma/client";
import ApiError from "../error";
import {
  OfficerLogCreateFormData,
  OfficerLogsGetData,
  OfficerLogUpdateData,
} from "@/types/models/Log";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getOfficerLog = async (id: number): Promise<OfficerLog> => {
  const officerLog = await prisma.officerLog.findUnique({ where: { id } });
  if (!officerLog)
    throw new ApiError(`OfficerLog with id: ${id} not found.`, 404);

  return officerLog;
};

export const getOfficerLogList = async (
  officerLogGetData: OfficerLogsGetData = {}
): Promise<PaginatedResponse<OfficerLog>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "action_at",
    sortDirection,
  } = officerLogGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.OfficerLogWhereInput = {};

  if (search) {
    where.action = { contains: search };
  }

  const totalCount = await prisma.officerLog.count({ where });

  let officerLogs = await prisma.officerLog.findMany({
    where,
    include: {
      Officer: {
        include: {
          member: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  officerLogs = Array.isArray(officerLogs) ? officerLogs : [];

  const result = {
    items: officerLogs.map((officerLogs) => officerLogs),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + officerLogs.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createOfficerLog = async (
  officerLogCreateData: OfficerLogCreateFormData
): Promise<OfficerLog> => {
  const officerLog = await prisma.officerLog.create({
    data: {
      action: officerLogCreateData.action,
      action_by: officerLogCreateData.officer_id,
      officer_id: officerLogCreateData.officer_id,
    },
  });

  return officerLog;
};

export const updateOfficerLog = async (
  id: number,
  officerLogUpdateData: OfficerLogUpdateData
): Promise<OfficerLog> => {
  const officerLog = await prisma.officerLog.update({
    where: { id },
    data: officerLogUpdateData,
  });

  return officerLog;
};

export const deleteOfficerLog = async (id: number): Promise<OfficerLog> => {
  const officerLog = await prisma.officerLog.delete({ where: { id } });

  return officerLog;
};
