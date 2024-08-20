import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { News } from "@prisma/client";
import { NewsCreateData, NewsCreateFormData } from "@/types/models/News";

const createNews = async (news: NewsCreateFormData) => {
  const { data } = await axiosInstance.post<News>(Routes.API.NEWS, news);
  return data;
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation<News, AxiosError, NewsCreateFormData, unknown>({
    mutationFn: (news) => createNews(news),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.NEWS] });
    },
  });
};
