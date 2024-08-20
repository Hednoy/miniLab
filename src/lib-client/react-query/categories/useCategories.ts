import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { CategoriesGetData } from "@/types/models";
import { Routes } from "@/lib-client/constants";
import { Category } from "@prisma/client";

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    hasMore: boolean;
  };
}

const getCategories = async (
  params: CategoriesGetData
): Promise<PaginatedResponse<Category>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Category>>(
    Routes.API.CATEGORIES,
    { params }
  );
  return data;
};

export const useCategories = (
  queryKey: QueryKeysType,
  params: CategoriesGetData
) => {
  const queryClient = useQueryClient();
  const { page = 1, searchTerm } = params;

  const isEnabled = queryKey !== QueryKeys.POSTS_DRAFTS;

  const query = useQuery<PaginatedResponse<Category>, AxiosError>({
    // key must match getServerSideProps or hydration error
    queryKey: filterEmptyKeys([queryKey, searchTerm, page]),
    queryFn: () => getCategories(params),
  });

  // {
  //   keepPreviousData: true,
  //   staleTime: 5000,
  //   enabled: isEnabled,
  // }

  const hasMore = query.data?.pagination.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery({
        queryKey: filterEmptyKeys([queryKey, searchTerm, page + 1]),
        queryFn: () => getCategories({ ...params, page: page + 1 }),
      });
    }
  }, [hasMore, page, queryClient]);

  return query;
};
