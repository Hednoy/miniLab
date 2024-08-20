import { PaginatedResponse } from "@/types";
import { TestType } from "@prisma/client";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { TestTypesGetData } from "@/types/models/TestType";

const getTestTypeAll = async (): Promise<PaginatedResponse<TestType>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<TestType>>(
    Routes.API.TEST_TYPE
  );
  return data;
};

export const useTestTypeAll = () => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<TestType>,
    AxiosError
  >({
    queryKey: [QueryKeys.TEST_TYPE],
    queryFn: () => getTestTypeAll(),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
  };
};

const getTestTypes = async (
  params: TestTypesGetData
): Promise<PaginatedResponse<TestType>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<TestType>>(
    Routes.API.TEST_TYPE,
    { params }
  );
  return data;
};

export const useTestTypes = (params: TestTypesGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<TestType>,
    AxiosError
  >({
    queryKey: [QueryKeys.TEST_TYPE, params],
    queryFn: () => getTestTypes(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getTestTypeById = async (id: number | undefined): Promise<TestType> => {
  const { data } = await axiosInstance.get<TestType>(
    `${Routes.API.TEST_TYPE}/${id}`
  );
  return data;
};

export const useTestTypeById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<TestType, AxiosError>({
    queryKey: [QueryKeys.TEST_TYPE, { id }],
    queryFn: () => getTestTypeById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
