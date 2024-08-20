import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { Officer } from "@prisma/client";

interface DeleteOfficerParams {
  id: number;
  memberId: number;
}

const deleteOfficerById = async ({
  id,
  memberId,
}: DeleteOfficerParams): Promise<Officer> => {
  const { data } = await axiosInstance.delete<Officer>(
    `${Routes.API.OFFICER}/${id}`,
    { data: { memberId } }
  );
  return data;
};

export const useDeleteOfficerById = () => {
  const queryClient = useQueryClient();

  return useMutation<Officer, Error, DeleteOfficerParams, unknown>({
    mutationFn: (params) => deleteOfficerById(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.OFFICER],
      });
    },
  });
};
