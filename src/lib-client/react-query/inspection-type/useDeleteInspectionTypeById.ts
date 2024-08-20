import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { InspectionType } from "@prisma/client";

const deleteInspectiontById = async (id: number): Promise<InspectionType> => {
  const { data } = await axiosInstance.delete<InspectionType>(
    `${Routes.API.INSPECTION_TYPE}/${id}`
  );
  return data;
};

export const useDeleteInspectionTypeById = () => {
  const queryClient = useQueryClient();

  return useMutation<InspectionType, Error, number, unknown>({
    mutationFn: (id) => deleteInspectiontById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.INSPECTION_TYPE],
      });
    },
  });
};
