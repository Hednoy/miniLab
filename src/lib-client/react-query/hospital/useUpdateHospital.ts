import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { Hospital } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { HospitalUpdateForm } from "@/types/models/Hospital";

const updateHospital = async ({ id, ...updateData }: HospitalUpdateForm) => {
  const { data } = await axiosInstance.put<Hospital>(
    `${Routes.API.HOSPITAL}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation<Hospital, Error, HospitalUpdateForm, unknown>({
    mutationFn: (hospital) => updateHospital(hospital),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOSPITAL],
      });
    },
  });
};
