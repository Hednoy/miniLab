import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";
import { Category } from "@prisma/client";
import { CategoryCreateData } from "@/types/models";

const createCategory = async (category: CategoryCreateData) => {
  const { data } = await axiosInstance.post<Category>(
    Routes.API.CATEGORIES,
    category
  );
  return data;
};

export const useCreateCategory = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Category,
    AxiosError,
    CategoryCreateData,
    unknown
  >({
    mutationFn: (category) => createCategory(category),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] });
      await router.push(Routes.SITE.BACKOFFICE.CATEGORIES);
    },
  });

  return mutation;
};
