import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { InspectionType, Patient } from "@prisma/client";
import { InspectionTypesGetData } from "@/types/models/InspectionType";

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

const getInspectionTypes = async (
  params: InspectionTypesGetData
): Promise<PaginatedResponse<InspectionType>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<InspectionType>>(
    Routes.API.INSPECTION_TYPE,
    { params }
  );
  return data;
};

export const useInspectionTypes = (params: InspectionTypesGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<InspectionType>,
    AxiosError
  >({
    queryKey: [QueryKeys.INSPECTION_TYPE, params],
    queryFn: () => getInspectionTypes(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getInspectionTypeById = async (
  id: number | undefined
): Promise<InspectionType> => {
  const { data } = await axiosInstance.get<InspectionType>(
    `${Routes.API.INSPECTION_TYPE}/${id}`
  );
  return data;
};

export const useInspectionTypeById = (
  id: number | undefined,
  options: any = {}
) => {
  const query = useQuery<InspectionType, AxiosError>({
    queryKey: [QueryKeys.INSPECTION_TYPE, { id }],
    queryFn: () => getInspectionTypeById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
