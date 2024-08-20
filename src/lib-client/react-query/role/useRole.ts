import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { Role } from "@prisma/client";
import { RolesGetData } from "@/types/models/Role";

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

const getRoles = async (
  params: RolesGetData
): Promise<PaginatedResponse<Role>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Role>>(
    Routes.API.ROLE,
    { params }
  );
  return data;
};

export const useRoles = (params: RolesGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<Role>,
    AxiosError
  >({
    queryKey: [QueryKeys.ROLE, params],
    queryFn: () => getRoles(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getRole = async (id: number | undefined): Promise<Role> => {
  const { data } = await axiosInstance.get<Role>(`${Routes.API.ROLE}/${id}`);
  return data;
};

export const useRoleById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<Role, AxiosError>({
    queryKey: [QueryKeys.ROLE, { id }],
    queryFn: () => getRole(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
