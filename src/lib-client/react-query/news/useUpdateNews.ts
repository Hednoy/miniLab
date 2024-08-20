import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "../queryKeys";
import { News, Patient } from "@prisma/client";
import { NewsUpdateForm } from "@/types/models/News";

const updateNews = async ({ id, ...updateData }: NewsUpdateForm) => {
  const { data } = await axiosInstance.put<News>(`${Routes.API.NEWS}/${id}`, {
    ...updateData,
  });
  return data;
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation<News, Error, NewsUpdateForm, unknown>({
    mutationFn: (news) => updateNews(news),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NEWS],
      });
    },
  });
};
