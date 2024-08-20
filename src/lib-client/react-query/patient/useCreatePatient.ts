import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Patient } from "@prisma/client";
import { PatientCreateData } from "@/types/models/Patient";

const createPatient = async (patient: PatientCreateData) => {
  const { data } = await axiosInstance.post<Patient>(
    Routes.API.PATIENT,
    patient
  );
  return data;
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation<Patient, AxiosError, PatientCreateData, unknown>({
    mutationFn: (patient) => createPatient(patient),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.PATIENT] });
    },
  });
};
