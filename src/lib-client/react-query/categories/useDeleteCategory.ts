import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { Category } from "@prisma/client";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";

const deleteCategory = async (id: number): Promise<Category> => {
  const { data } = await axiosInstance.delete<Category>(
    `${Routes.API.CATEGORIES}${id}`
  );
  return data;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Category, AxiosError, number, unknown>({
    mutationFn: (id) => deleteCategory(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORY] }),
      ]);
    },
  });

  return mutation;
};
