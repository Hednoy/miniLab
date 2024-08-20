import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Lab } from "@prisma/client";

const deleteLabById = async (id: number): Promise<Lab> => {
  const { data } = await axiosInstance.delete<Lab>(`${Routes.API.LAB}/${id}`);
  return data;
};

export const useDeleteLabById = () => {
  const queryClient = useQueryClient();

  return useMutation<Lab, Error, number, unknown>({
    mutationFn: (id) => deleteLabById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LAB],
      });
    },
  });
};
