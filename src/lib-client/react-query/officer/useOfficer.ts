import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { Officer } from "@prisma/client";
import {
  OfficerGetData,
  OfficerListData,
  OfficersGetData,
} from "@/types/models";

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    pagesCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMore: boolean;
  };
}

const getOfficers = async (
  params: OfficersGetData
): Promise<PaginatedResponse<OfficerListData>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<OfficerListData>>(
    Routes.API.OFFICER,
    { params }
  );
  return data;
};

export const useOfficers = (params: OfficersGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<OfficerListData>,
    AxiosError
  >({
    queryKey: [QueryKeys.OFFICER, params],
    queryFn: () => getOfficers(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getOfficer = async (id: number | undefined): Promise<OfficerGetData> => {
  const { data } = await axiosInstance.get<OfficerGetData>(
    `${Routes.API.OFFICER}/${id}`
  );
  data.password = "";
  return data;
};

export const useOfficerById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<OfficerGetData, AxiosError>({
    queryKey: [QueryKeys.OFFICER, { id }],
    queryFn: () => getOfficer(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
