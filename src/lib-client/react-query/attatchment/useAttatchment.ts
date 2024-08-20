import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { Attachment, Patient } from "@prisma/client";
import { PatientsGetData } from "@/types/models/Patient";
import { AttachmentsGetData } from "@/types/models/Attachment";

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

const getAttatchments = async (
  params: AttachmentsGetData
): Promise<PaginatedResponse<Attachment>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Attachment>>(
    Routes.API.ATTACHMENT,
    { params }
  );
  return data;
};

export const useAttatchments = (params: AttachmentsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<Attachment>,
    AxiosError
  >({
    queryKey: [QueryKeys.ATTACHMENT, params],
    queryFn: () => getAttatchments(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};
