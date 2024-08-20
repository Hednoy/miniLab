import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys, { QueryKeysType, filterEmptyKeys } from "../queryKeys";
import { PersonsGetData } from "@/types/models";
import { Routes } from "@/lib-client/constants";
import { Person } from "@prisma/client";

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

const getPersons = async (
  params: PersonsGetData
): Promise<PaginatedResponse<Person>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Person>>(
    Routes.API.PERSON,
    { params }
  );
  return data;
};

const getPersonById = async (id: number): Promise<Person> => {
  const { data } = await axiosInstance.get<Person>(
    `${Routes.API.PERSON}/${id}`
  );
  return data;
};

export const usePersons = (queryKey: QueryKeysType, params: PersonsGetData) => {
  const queryClient = useQueryClient();
  const { page = 1, searchTerm } = params;

  const isEnabled = queryKey !== QueryKeys.POSTS_DRAFTS;

  const query = useQuery<PaginatedResponse<Person>, AxiosError>({
    queryKey: filterEmptyKeys([queryKey, searchTerm, page]),
    queryFn: () => getPersons(params),
  });

  const hasMore = query.data?.pagination?.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery({
        queryKey: filterEmptyKeys([queryKey, searchTerm, page + 1]),
        queryFn: () => getPersons({ ...params, page: page + 1 }),
      });
    }
  }, [hasMore, page, queryClient]);

  return query;
};

export const usePerson = (id: number, options: any = {}) => {
  const query = useQuery<Person, AxiosError>({
    queryKey: [QueryKeys.PERSON, { id }],
    queryFn: () => getPersonById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
