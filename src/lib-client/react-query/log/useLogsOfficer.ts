import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { LogActionList, OfficerLogsGetData } from "@/types/models/Log";

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

const getLogsOfficer = async (
  params: OfficerLogsGetData
): Promise<PaginatedResponse<LogActionList>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<LogActionList>>(
    Routes.API.LOG_OFFICER,
    { params }
  );
  return data;
};

export const useLogsOfficer = (params: OfficerLogsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<LogActionList>,
    AxiosError
  >({
    queryKey: [QueryKeys.LOG_OFFICER, params],
    queryFn: () => getLogsOfficer(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};
