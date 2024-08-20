import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { LabTestForReport, LabTestsGetData } from "@/types/models/LabTest";

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

const getDashboard = async (
  params: LabTestsGetData
): Promise<PaginatedResponse<LabTestForReport>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<LabTestForReport>>(
    Routes.API.DASHBOARD,
    { params }
  );
  return data;
};

export const useDashboard = (params: LabTestsGetData, isSearch: boolean) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<LabTestForReport>,
    AxiosError
  >({
    queryKey: [
      QueryKeys.DASHBOARD,
      params.page,
      params.sort,
      params.sortDirection,
      isSearch,
    ],
    queryFn: () => getDashboard(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};
