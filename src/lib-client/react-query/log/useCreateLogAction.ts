import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { AxiosError } from "axios";
import { Routes } from "@/lib-client/constants";
import { LogActionCreate } from "@/types/models/Log";
import { useSession } from "next-auth/react";

const createLogAction = async (logAction: LogActionCreate) => {
  const { data } = await axiosInstance.post<any>(
    Routes.API.LOG_OFFICER,
    logAction
  );
  return data;
};

export const useCreateLogAction = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any, AxiosError, LogActionCreate, unknown>({
    mutationFn: (logAction) =>
      createLogAction({
        ...logAction,
        officer_id: session?.user.officerId ?? 0,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.LOG_OFFICER],
      });
    },
  });
};
