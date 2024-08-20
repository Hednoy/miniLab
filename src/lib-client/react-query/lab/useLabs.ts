import { PaginatedResponse } from "@/types";
import { Lab } from "@prisma/client";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { LabGetByID, LabSearchData, LabsGetData } from "@/types/models/Lab";

const getLabs = async (
  params: LabsGetData
): Promise<PaginatedResponse<LabSearchData>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<LabSearchData>>(
    Routes.API.LAB,
    { params }
  );
  return data;
};

export const useLabs = (params: LabsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<LabSearchData>,
    AxiosError
  >({
    queryKey: [QueryKeys.LAB, params],
    queryFn: () => getLabs(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getLabById = async (id: number | undefined): Promise<LabGetByID> => {
  const { data } = await axiosInstance.get<LabGetByID>(
    `${Routes.API.LAB}/${id}`
  );
  return data;
};

export const useLabById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<LabGetByID, AxiosError>({
    queryKey: [QueryKeys.LAB, { id }],
    queryFn: () => getLabById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
