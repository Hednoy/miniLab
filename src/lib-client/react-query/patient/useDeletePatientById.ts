import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Patient } from "@prisma/client";

const deletePatientById = async (id: number): Promise<Patient> => {
  const { data } = await axiosInstance.delete<Patient>(
    `${Routes.API.PATIENT}/${id}`
  );
  return data;
};

export const useDeletePatientById = () => {
  const queryClient = useQueryClient();

  return useMutation<Patient, Error, number, unknown>({
    mutationFn: (id) => deletePatientById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PATIENT],
      });
    },
  });
};
