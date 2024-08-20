import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Pathogens } from "@prisma/client";
import { PathogensCreateData } from "@/types/models/Pathogens";

const createPathogens = async (pathogens: PathogensCreateData) => {
  const { data } = await axiosInstance.post<Pathogens>(
    Routes.API.PATHOGENTS,
    pathogens
  );
  return data;
};

export const useCreatePathogens = () => {
  const queryClient = useQueryClient();
  return useMutation<Pathogens, AxiosError, PathogensCreateData, unknown>({
    mutationFn: (pathogens) => createPathogens(pathogens),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PATHOGENTS],
      });
    },
  });
};
