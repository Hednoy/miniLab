import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Pathogens } from "@prisma/client";

const deletePathogensById = async (id: number): Promise<Pathogens> => {
  const { data } = await axiosInstance.delete<Pathogens>(
    `${Routes.API.PATHOGENTS}/${id}`
  );
  return data;
};

export const useDeletePathogensById = () => {
  const queryClient = useQueryClient();
  return useMutation<Pathogens, Error, number, unknown>({
    mutationFn: (id) => deletePathogensById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PATHOGENTS],
      });
    },
  });
};
