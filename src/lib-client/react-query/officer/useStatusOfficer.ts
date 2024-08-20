import { Officer } from "@prisma/client";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { OfficerUpdateStatus } from "@/types/models";

const updateStatusOfficer = async ({ id, status }: OfficerUpdateStatus) => {
  const { data } = await axiosInstance.post<Officer>(
    `${Routes.API.OFFICER}/${id}/is-active`,
    { is_active: status }
  );
  return data;
};

export const useUpdateStatusOfficer = () => {
  const queryClient = useQueryClient();
  return useMutation<Officer, Error, OfficerUpdateStatus, unknown>({
    mutationFn: (officer) => updateStatusOfficer(officer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.OFFICER],
      });
    },
  });
};
