import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { TestType } from "@prisma/client";
import { TestTypeCreateData } from "@/types/models/TestType";

const createTestType = async (testType: TestTypeCreateData) => {
  const { data } = await axiosInstance.post<TestType>(
    Routes.API.TEST_TYPE,
    testType
  );
  return data;
};

export const useCreateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation<TestType, AxiosError, TestTypeCreateData, unknown>({
    mutationFn: (testType) => createTestType(testType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEST_TYPE],
      });
    },
  });
};
