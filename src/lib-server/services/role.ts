import prisma from "@/lib-server/prisma";
import { Role, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  RoleCreateFormData,
  RoleUpdateData,
  RolesGetData,
} from "@/types/models/Role";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getRole = async (role_id: number): Promise<Role> => {
  const role = await prisma.role.findUnique({ where: { role_id } });
  if (!role) throw new ApiError(`Role with id: ${role_id} not found.`, 404);

  return role;
};

export const getRoleList = async (
  roleGetData: RolesGetData = {}
): Promise<PaginatedResponse<Role>> => {
  const { page = 1, limit = 999, searchTerm, sortDirection } = roleGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.RoleWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.role.count({ where });

  let roles = await prisma.role.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  roles = Array.isArray(roles) ? roles : [];

  const result = {
    items: roles.map((roles) => roles),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + roles.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createRole = async (
  roleCreateData: RoleCreateFormData
): Promise<Role> => {
  const role = await prisma.role.create({ data: roleCreateData });
  return role;
};

export const updateRole = async (
  role_id: number,
  roleUpdateData: RoleUpdateData
): Promise<Role> => {
  const role = await prisma.role.update({
    where: { role_id },
    data: roleUpdateData,
  });
  return role;
};

export const deleteRole = async (role_id: number): Promise<Role> => {
  const role = await prisma.role.delete({ where: { role_id } });
  return role;
};
