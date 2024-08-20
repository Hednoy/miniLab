import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { ProvincesGetData } from "@/types/models";
import { Routes } from "@/lib-client/constants";
import { Provinces } from "@prisma/client";

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

const getProvinces = async (
  params: ProvincesGetData
): Promise<PaginatedResponse<Provinces>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Provinces>>(
    Routes.API.PROVINCES,
    { params }
  );
  return data;
};

export const useProvinces = (
  queryKey: QueryKeysType,
  params: ProvincesGetData
) => {
  const queryClient = useQueryClient();
  const { page = 1, searchTerm } = params;

  const isEnabled = queryKey !== QueryKeys.POSTS_DRAFTS;

  const query = useQuery<PaginatedResponse<Provinces>, AxiosError>({
    queryKey: filterEmptyKeys([queryKey, searchTerm, page]),
    queryFn: () => getProvinces(params),
  });

  const hasMore = query.data?.pagination?.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery({
        queryKey: filterEmptyKeys([queryKey, searchTerm, page + 1]),
        queryFn: () => getProvinces({ ...params, page: page + 1 }),
      });
    }
  }, [hasMore, page, queryClient]);

  return query;
};
