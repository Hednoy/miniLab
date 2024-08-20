import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { RoleCreateData } from "@/types/models/Role";
import { Role } from "@prisma/client";

const createRole = async (role: RoleCreateData) => {
  const { data } = await axiosInstance.post<Role>(Routes.API.ROLE, role);
  return data;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, AxiosError, RoleCreateData, unknown>({
    mutationFn: (role) => createRole(role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.ROLE] });
    },
  });
};
