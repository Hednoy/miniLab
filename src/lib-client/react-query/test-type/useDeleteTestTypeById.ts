import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { TestType } from "@prisma/client";

const deleteTestTypeById = async (id: number): Promise<TestType> => {
  const { data } = await axiosInstance.delete<TestType>(
    `${Routes.API.TEST_TYPE}/${id}`
  );
  return data;
};

export const useDeleteTestTypeById = () => {
  const queryClient = useQueryClient();
  return useMutation<TestType, Error, number, unknown>({
    mutationFn: (id) => deleteTestTypeById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEST_TYPE],
      });
    },
  });
};
