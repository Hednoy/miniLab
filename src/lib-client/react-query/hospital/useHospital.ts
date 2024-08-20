import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { Hospital } from "@prisma/client";
import { HospitalsGetData } from "@/types/models/Hospital";

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

const getHospitalList = async (
  params: HospitalsGetData
): Promise<PaginatedResponse<Hospital>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Hospital>>(
    Routes.API.HOSPITAL,
    { params }
  );
  return data;
};

export const useHospitalList = (params: HospitalsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<Hospital>,
    AxiosError
  >({
    queryKey: [QueryKeys.HOSPITAL, params],
    queryFn: () => getHospitalList(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getHospital = async (id: number | undefined): Promise<Hospital> => {
  const { data } = await axiosInstance.get<Hospital>(
    `${Routes.API.HOSPITAL}/${id}`
  );
  return data;
};

export const useHospitalById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<Hospital, AxiosError>({
    queryKey: [QueryKeys.HOSPITAL, { id }],
    queryFn: () => getHospital(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

const getHospitalAll = async (): Promise<PaginatedResponse<Hospital>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Hospital>>(
    Routes.API.HOSPITAL
  );
  return data;
};

export const useHospitalAll = () => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<Hospital>,
    AxiosError
  >({
    queryKey: [QueryKeys.HOSPITAL],
    queryFn: () => getHospitalAll(),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
  };
};
