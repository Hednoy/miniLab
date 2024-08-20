import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { LabTestChart, LabTestChartParams } from "@/types/models/LabTest";

const getDashboardChart = async (
  params: LabTestChartParams
): Promise<LabTestChart> => {
  const { data } = await axiosInstance.get<LabTestChart>(
    `${Routes.API.DASHBOARD_CHART}`,
    { params }
  );
  return data;
};

const getDashboardChartPathogens = async (
  params: LabTestChartParams
): Promise<LabTestChart> => {
  const { data } = await axiosInstance.get<LabTestChart>(
    `${Routes.API.DASHBOARD_CHART_PATHOGENS}`,
    { params }
  );
  return data;
};

export const useDashboardChart = (params: LabTestChartParams) => {
  const query = useQuery<LabTestChart, AxiosError>({
    queryKey: [QueryKeys.DASHBOARD_CHART, params],
    queryFn: () => getDashboardChart(params),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};

export const useDashboardChartPathogens = (params: LabTestChartParams) => {
  const query = useQuery<any, AxiosError>({
    queryKey: [QueryKeys.DASHBOARD_PATHOGENS, params],
    queryFn: () => getDashboardChartPathogens(params),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
