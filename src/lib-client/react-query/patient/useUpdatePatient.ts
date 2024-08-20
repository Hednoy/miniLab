import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { PatientUpdateForm } from "@/types/models/Patient";
import { Patient } from "@prisma/client";

const updatePatient = async ({ id, ...updateData }: PatientUpdateForm) => {
  const { data } = await axiosInstance.put<Patient>(
    `${Routes.API.PATIENT}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation<Patient, Error, PatientUpdateForm, unknown>({
    mutationFn: (patient) => updatePatient(patient),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PATIENT],
      });
    },
  });
};
