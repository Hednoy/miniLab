import { PaginatedResponse } from "@/types";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { TestTypeForDD } from "@/types/models/TestType";

const getDetectionMethods = async (): Promise<TestTypeForDD[]> => {
  const { data } = await axiosInstance.get<TestTypeForDD[]>(
    Routes.API.DETECTION_METHOD
  );
  return data;
};

export const useDetectionMethod = () => {
  const { data, isError, isLoading, refetch } = useQuery<
    TestTypeForDD[],
    AxiosError
  >({
    queryKey: [QueryKeys.DETECTION_METHOD],
    queryFn: () => getDetectionMethods(),
  });

  return {
    data: data || [],
  };
};
