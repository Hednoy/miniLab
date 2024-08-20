import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Lab, Officer } from "@prisma/client";
import { OfficerCreateFormData } from "@/types/models";
import { LabCreateFormData } from "@/types/models/Lab";

const createLab = async (lab: LabCreateFormData) => {
  const { data } = await axiosInstance.post<Lab>(Routes.API.LAB, lab);
  return data;
};

export const useCreateLab = () => {
  const queryClient = useQueryClient();
  return useMutation<Lab, AxiosError, LabCreateFormData, unknown>({
    mutationFn: (lab) => createLab(lab),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.LAB] });
    },
  });
};
