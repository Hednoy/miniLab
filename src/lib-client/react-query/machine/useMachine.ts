import { PaginatedResponse } from "@/types";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { Machine } from "@prisma/client";
import { MachineList, MachinesGetData } from "@/types/models/Machine";

const getMachines = async (
  params: MachinesGetData
): Promise<PaginatedResponse<MachineList>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<MachineList>>(
    Routes.API.MACHINE,
    { params }
  );
  return data;
};

export const useMachines = (params: MachinesGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<MachineList>,
    AxiosError
  >({
    queryKey: [QueryKeys.MACHINE, params],
    queryFn: () => getMachines(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getMachineById = async (id: number | undefined): Promise<Machine> => {
  const { data } = await axiosInstance.get<Machine>(
    `${Routes.API.MACHINE}/${id}`
  );
  return data;
};

export const useMachineById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<Machine, AxiosError>({
    queryKey: [QueryKeys.MACHINE, { id }],
    queryFn: () => getMachineById(id),
    enabled: id,
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
