import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { TambonsGetData } from "@/types/models";
import { Routes } from "@/lib-client/constants";
import { Tambons } from "@prisma/client";

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

const getTambons = async (
  params: TambonsGetData
): Promise<PaginatedResponse<Tambons>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Tambons>>(
    Routes.API.TAMBONS,
    { params }
  );
  return data;
};

export const useTambons = (queryKey: QueryKeysType, params: TambonsGetData) => {
  const queryClient = useQueryClient();
  const { page = 1, searchTerm, amphureId } = params;

  const isEnabled = amphureId !== undefined;

  const query = useQuery<PaginatedResponse<Tambons>, AxiosError>({
    queryKey: filterEmptyKeys([queryKey, searchTerm, page]),
    queryFn: () => getTambons(params),
    enabled: isEnabled,
  });

  const hasMore = query.data?.pagination?.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery({
        queryKey: filterEmptyKeys([queryKey, searchTerm, page + 1]),
        queryFn: () => getTambons({ ...params, page: page + 1 }),
      });
    }
  }, [hasMore, page, queryClient]);

  return query;
};
