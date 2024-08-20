import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { InspectionType } from "@prisma/client";
import { InspectionTypeUpdateForm } from "@/types/models/InspectionType";

const updateInspectionType = async ({
  id,
  ...updateData
}: InspectionTypeUpdateForm) => {
  const { data } = await axiosInstance.put<InspectionType>(
    `${Routes.API.INSPECTION_TYPE}/${id}`,
    { ...updateData }
  );
  return data;
};

export const useUpdateInspectionType = () => {
  const queryClient = useQueryClient();
  return useMutation<InspectionType, Error, InspectionTypeUpdateForm, unknown>({
    mutationFn: (inspectionType) => updateInspectionType(inspectionType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.INSPECTION_TYPE],
      });
    },
  });
};
