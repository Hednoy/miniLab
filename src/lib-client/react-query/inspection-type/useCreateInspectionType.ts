import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { InspectionType } from "@prisma/client";
import { InspectionTypeCreateData } from "@/types/models/InspectionType";

const createInspectionType = async (
  inspectionType: InspectionTypeCreateData
) => {
  const { data } = await axiosInstance.post<InspectionType>(
    Routes.API.INSPECTION_TYPE,
    inspectionType
  );
  return data;
};

export const useCreateInspectionType = () => {
  const queryClient = useQueryClient();
  return useMutation<
    InspectionType,
    AxiosError,
    InspectionTypeCreateData,
    unknown
  >({
    mutationFn: (inspectionType) => createInspectionType(inspectionType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.INSPECTION_TYPE],
      });
    },
  });
};
