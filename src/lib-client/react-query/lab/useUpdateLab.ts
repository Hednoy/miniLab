import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Lab } from "@prisma/client";
import { LabUpdateForm } from "@/types/models/Lab";

const updateLab = async ({ id, ...updateData }: LabUpdateForm) => {
  const { data } = await axiosInstance.put<Lab>(`${Routes.API.LAB}/${id}`, {
    ...updateData,
  });
  return data;
};

export const useUpdateLab = () => {
  const queryClient = useQueryClient();
  return useMutation<Lab, Error, LabUpdateForm, unknown>({
    mutationFn: (lab) => updateLab(lab),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LAB],
      });
    },
  });
};
