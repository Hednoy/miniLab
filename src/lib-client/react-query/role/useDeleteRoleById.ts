import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Role } from "@prisma/client";

const deleteRoleById = async (id: number): Promise<Role> => {
  const { data } = await axiosInstance.delete<Role>(`${Routes.API.ROLE}/${id}`);
  return data;
};

export const useDeleteRoleById = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, number, unknown>({
    mutationFn: (id) => deleteRoleById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROLE],
      });
    },
  });
};
