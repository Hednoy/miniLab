import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { News } from "@prisma/client";
import { NewsGetDataForm, NewssGetData } from "@/types/models/News";
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

const getNews = async (
  params: NewssGetData
): Promise<PaginatedResponse<News>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<News>>(
    Routes.API.NEWS,
    { params }
  );
  return data;
};

export const useNews = (params: NewssGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<News>,
    AxiosError
  >({
    queryKey: [QueryKeys.NEWS, params],
    queryFn: () => getNews(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getNewsById = async (
  id: number | undefined
): Promise<NewsGetDataForm> => {
  const { data } = await axiosInstance.get<NewsGetDataForm>(
    `${Routes.API.NEWS}/${id}`
  );
  return data;
};

export const useNewsById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<NewsGetDataForm, AxiosError>({
    queryKey: [QueryKeys.NEWS, { id }],
    queryFn: () => getNewsById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
