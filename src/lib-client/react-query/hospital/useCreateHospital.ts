import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Hospital } from "@prisma/client";
import { HospitalCreateData } from "@/types/models/Hospital";

const createHospital = async (hospital: HospitalCreateData) => {
  const { data } = await axiosInstance.post<Hospital>(
    Routes.API.HOSPITAL,
    hospital
  );
  return data;
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation<Hospital, AxiosError, HospitalCreateData, unknown>({
    mutationFn: (hospital) => createHospital(hospital),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.HOSPITAL] });
    },
  });
};
