import prisma from "@/lib-server/prisma";
import ApiError from "@/lib-server/error";
import {
  OfficerCreateData,
  OfficerCreateFormData,
  OfficerGetByID,
  OfficersGetData,
  OfficerUpdateData,
} from "@/types/models";
import { hash } from "bcryptjs";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";
import { Officer, Prisma } from "@prisma/client";

export const getOfficer = async (id: number): Promise<OfficerGetByID> => {
  const officer = await prisma.officer.findUnique({
    where: { id },
    include: {
      role: true,
      member: true,
      Attachment: true,
    },
  });

  if (!officer) throw new ApiError(`Officer with id: ${id} not found.`, 404);

  const officerByID: OfficerGetByID = {
    id: officer.id,
    citizen_id: officer.citizen_id || "",
    first_name: officer.first_name,
    last_name: officer.last_name || "",
    nickname: officer.nickname || "",
    mobile_phone: officer.mobile_phone || "",
    email: officer.email || "",
    username: officer.member?.username || "",
    // password: officer.member?.password || "",
    is_active: officer.is_active,
    position: officer.position || "",
    department: officer.department || "",
    role_id: officer.role_id,
  };

  return officerByID;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getOfficers = async (
  officersGetData: OfficersGetData = {}
): Promise<PaginatedResponse<Officer>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = officersGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.OfficerWhereInput = {};

  if (search) {
    where.first_name = { contains: search };
  }

  const totalCount = await prisma.officer.count({ where });

  let officers = await prisma.officer.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      role: true,
      member: true,
      Attachment: true,
    },
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  officers = Array.isArray(officers) ? officers : [];

  const result = {
    items: officers.map((officer) => officer),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + officers.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createOfficer = async (
  createData: OfficerCreateFormData
): Promise<Officer> => {
  // unique citizen
  const _user1 = await prisma.member.findFirst({
    where: { username: createData.username },
  });
  if (_user1)
    throw new ApiError(
      `User with username : ${createData.username} already exists.`,
      409
    );

  const password = await hash(createData.password, 10);

  const user = await prisma.member.create({
    data: {
      username: createData.username,
      password: password,
      role_id: createData.role_id,
    },
  });

  const officer = await prisma.officer.create({
    data: {
      citizen_id: createData.citizen_id,
      first_name: createData.first_name,
      last_name: createData.last_name,
      nickname: createData.nickname,
      mobile_phone: createData.mobile_phone,
      email: createData.email,
      position: createData.position,
      department: createData.department,
      is_active: true,
      member_id: user.id,
      role_id: createData.role_id,
    },
  });

  if (!officer) throw new ApiError("Officer not created.", 400);

  // convert Officer to OfficerWithAuthor
  const officerWithAuthor = await prisma.officer.findUnique({
    where: {
      id: officer.id,
    },
  });

  if (!officerWithAuthor) throw new ApiError("Create category failed.", 400);

  return officerWithAuthor;
};

export const updateOfficer = async (
  id: number,
  officerUpdateData: OfficerCreateFormData
): Promise<Officer> => {
  const {
    email,
    first_name,
    is_active,
    last_name,
    nickname,
    mobile_phone,
    citizen_id,
    position,
    department,
    username,
    password,
    role_id,
  } = officerUpdateData;

  const _officer = await prisma.officer.findUnique({ where: { id } });
  if (!_officer) throw new ApiError(`Officer with id: ${id} not found.`, 404);

  const data = {
    ...(email && { email }),
    ...(nickname && { nickname }),
    ...(first_name && { first_name }),
    ...(is_active && { is_active }),
    ...(last_name && { last_name }),
    ...(mobile_phone && { mobile_phone }),
    ...(citizen_id && { citizen_id }),
    ...(position && { position }),
    ...(department && { department }),
    ...(role_id && { role_id }),
  };

  const officer = await prisma.officer.update({
    where: { id },
    data,
  });

  const member = await prisma.member.update({
    where: { id: _officer.member_id },
    data: {
      ...(username && { username }),
      ...(role_id && { role_id }),
      // ...(password && { password: await hash(password, 10) }),
    },
  });

  if (!member) throw new ApiError("Update member failed.", 400);

  if (password) {
    const member2 = await prisma.member.update({
      where: { id: _officer.member_id },
      data: {
        // ...(username && { username }),
        ...(password && { password: await hash(password, 10) }),
      },
    });

    if (!member2) throw new ApiError("Update member failed.", 400);
  }

  if (!officer) throw new ApiError("Update officer failed.", 400);

  return officer;
};

export const updateIsActive = async (id: number, is_active: boolean) => {
  const _officer = await prisma.officer.findUnique({ where: { id } });
  if (!_officer) throw new ApiError(`Officer with id: ${id} not found.`, 404);

  const officer = await prisma.officer.update({
    where: { id },
    data: {
      is_active,
    },
  });

  if (!officer) throw new ApiError("Update officer failed.", 400);

  const member = await prisma.member.update({
    where: { id: _officer.member_id },
    data: {
      is_active,
    },
  });

  if (!member) throw new ApiError("Update member failed.", 400);

  return officer;
};

export const deleteOfficer = async (id: number): Promise<Officer> => {
  const _officer = await prisma.officer.findUnique({ where: { id } });
  if (!_officer) throw new ApiError(`Officer with id: ${id} not found.`, 404);

  const officer = await prisma.officer.delete({
    where: { id },
  });

  if (!officer) throw new ApiError("Delete category failed.", 400);

  const member = await prisma.member.delete({
    where: { id: _officer.member_id },
  });

  if (!member) throw new ApiError("Update member failed.", 400);

  return officer;
};
