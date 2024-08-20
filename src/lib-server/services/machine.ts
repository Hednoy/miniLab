import prisma from "@/lib-server/prisma";
import { Machine, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  MachineCreateFormData,
  MachineUpdateData,
  MachinesGetData,
} from "@/types/models/Machine";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getMachine = async (id: number): Promise<Machine> => {
  const machine = await prisma.machine.findUnique({
    where: { id },
    include: {
      Pathogens: true,
      MachineLab: true,
      Lab: true,
      MachineLog: true,
    },
  });
  if (!machine) throw new ApiError(`Machine with id: ${id} not found.`, 404);

  return machine;
};

export const getMachineList = async (
  machineGetData: MachinesGetData = {}
): Promise<PaginatedResponse<Machine>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = machineGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.MachineWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.machine.count({ where });

  let machines = await prisma.machine.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      Pathogens: true,
      MachineLab: true,
      Lab: true,
      MachineLog: true,
      TestType: true,
    },
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  machines = Array.isArray(machines) ? machines : [];

  const result = {
    items: machines.map((machines) => machines),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + machines.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createMachine = async (
  data: MachineCreateFormData
): Promise<Machine> => {
  const machine = await prisma.machine.create({
    data,
  });
  return machine;
};

export const updateMachine = async (
  id: number,
  data: MachineUpdateData
): Promise<Machine> => {
  const machine = await prisma.machine.update({
    where: { id },
    data,
  });

  return machine;
};

export const deleteMachine = async (id: number): Promise<Machine> => {
  const machine = await prisma.machine.delete({ where: { id } });

  return machine;
};
