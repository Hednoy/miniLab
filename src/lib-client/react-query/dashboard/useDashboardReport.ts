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

const getDashboardReport = async (params: LabTestsGetData): Promise<any> => {
  const { data } = await axiosInstance.get<any>(Routes.API.DASHBOARD_REPORT, {
    params,
  });
  return data;
};

export const useDashboardReport = async (params: LabTestsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<any, AxiosError>({
    queryKey: [QueryKeys.DASHBOARD_REPORT],
    queryFn: () => getDashboardReport(params),
  });

  return {
    data: data,
  };
};
