import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Pathogens } from "@prisma/client";
import { PathogensUpdateForm } from "@/types/models/Pathogens";

const updatePathogens = async ({ id, ...updateData }: PathogensUpdateForm) => {
  const { data } = await axiosInstance.put<Pathogens>(
    `${Routes.API.PATHOGENTS}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdatePathogens = () => {
  const queryClient = useQueryClient();
  return useMutation<Pathogens, Error, PathogensUpdateForm, unknown>({
    mutationFn: (inspectionType) => updatePathogens(inspectionType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PATHOGENTS],
      });
    },
  });
};
