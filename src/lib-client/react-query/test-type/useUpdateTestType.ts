import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { TestType } from "@prisma/client";
import { TestTypeUpdateForm } from "@/types/models/TestType";

const updateTestType = async ({ id, ...updateData }: TestTypeUpdateForm) => {
  const { data } = await axiosInstance.put<TestType>(
    `${Routes.API.TEST_TYPE}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation<TestType, Error, TestTypeUpdateForm, unknown>({
    mutationFn: (inspectionType) => updateTestType(inspectionType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEST_TYPE],
      });
    },
  });
};
