import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { News } from "@prisma/client";

const deleteNewsById = async (id: number): Promise<News> => {
  const { data } = await axiosInstance.delete<News>(`${Routes.API.NEWS}/${id}`);
  return data;
};

export const useDeleteNewsById = () => {
  const queryClient = useQueryClient();

  return useMutation<News, Error, number, unknown>({
    mutationFn: (id) => deleteNewsById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NEWS],
      });
    },
  });
};
