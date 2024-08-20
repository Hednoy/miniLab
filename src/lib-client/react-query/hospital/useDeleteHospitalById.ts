import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Hospital } from "@prisma/client";

const deleteHospitalById = async (id: number): Promise<Hospital> => {
  const { data } = await axiosInstance.delete<Hospital>(
    `${Routes.API.HOSPITAL}/${id}`
  );
  return data;
};

export const useDeleteHospitalById = () => {
  const queryClient = useQueryClient();

  return useMutation<Hospital, Error, number, unknown>({
    mutationFn: (id) => deleteHospitalById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOSPITAL],
      });
    },
  });
};
