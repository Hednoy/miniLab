import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { AmphuresGetData } from "@/types/models";
import { Routes } from "@/lib-client/constants";
import { Amphures } from "@prisma/client";

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

const getAmphures = async (
  params: AmphuresGetData
): Promise<PaginatedResponse<Amphures>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Amphures>>(
    Routes.API.AMPHURES,
    { params }
  );
  return data;
};

export const useAmphures = (
  queryKey: QueryKeysType,
  params: AmphuresGetData
) => {
  const queryClient = useQueryClient();
  const { page = 1, provinceId } = params;

  const isEnabled = provinceId !== undefined;

  const query = useQuery<PaginatedResponse<Amphures>, AxiosError>({
    queryKey: filterEmptyKeys([queryKey, page]),
    queryFn: () => getAmphures(params),
    enabled: isEnabled,
  });

  const hasMore = query.data?.pagination?.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery({
        queryKey: filterEmptyKeys([queryKey, page + 1]),
        queryFn: () => getAmphures({ ...params, page: page + 1 }),
      });
    }
  }, [hasMore, page, queryClient]);

  return query;
};
