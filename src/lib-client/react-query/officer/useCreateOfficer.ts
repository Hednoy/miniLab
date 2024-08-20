import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Officer } from "@prisma/client";
import { OfficerCreateFormData } from "@/types/models";

const createOfficer = async (officer: OfficerCreateFormData) => {
  const { data } = await axiosInstance.post<Officer>(
    Routes.API.OFFICER,
    officer
  );
  return data;
};

export const useCreateOfficer = () => {
  const queryClient = useQueryClient();
  return useMutation<Officer, AxiosError, OfficerCreateFormData, unknown>({
    mutationFn: (officer) => createOfficer(officer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.OFFICER] });
    },
  });
};
