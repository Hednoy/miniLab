import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Officer } from "@prisma/client";
import { OfficerUpdateForm } from "@/types/models";

const updateOfficer = async ({ id, ...updateData }: OfficerUpdateForm) => {
  const { data } = await axiosInstance.put<Officer>(
    `${Routes.API.OFFICER}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdateOfficer = () => {
  const queryClient = useQueryClient();
  return useMutation<Officer, Error, OfficerUpdateForm, unknown>({
    mutationFn: (officer) => updateOfficer(officer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.OFFICER],
      });
    },
  });
};
