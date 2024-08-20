import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Role } from "@prisma/client";
import { RoleUpdateForm } from "@/types/models/Role";

const updateRole = async ({ id, ...updateData }: RoleUpdateForm) => {
  const { data } = await axiosInstance.put<Role>(`${Routes.API.ROLE}/${id}`, {
    ...updateData,
  });
  return data;
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, RoleUpdateForm, unknown>({
    mutationFn: (role) => updateRole(role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROLE],
      });
    },
  });
};
