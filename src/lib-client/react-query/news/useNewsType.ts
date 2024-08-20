import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { News, NewsType } from "@prisma/client";
import { NewssGetData } from "@/types/models/News";
import { NewsTypesGetData } from "@/types/models/NewsType";

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

const getNewsType = async (): Promise<NewsType[]> => {
  const { data } = await axiosInstance.get<NewsType[]>(Routes.API.NEWS_TYPE);
  return data;
};

export const useNewsType = () => {
  const { data, isError, isLoading, refetch } = useQuery<
    NewsType[],
    AxiosError
  >({
    queryKey: [QueryKeys.NEWS_TYPE],
    queryFn: () => getNewsType(),
  });

  return {
    data: data || [],
    isError,
    isLoading,
  };
};
