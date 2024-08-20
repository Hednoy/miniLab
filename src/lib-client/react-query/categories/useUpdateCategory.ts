import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Routes } from "@/lib-client/constants";
import axiosInstance from "../axios";
import { Category } from "@prisma/client";
import { CategoryUpdateMutationData } from "@/types/models";
import QueryKeys from "../queryKeys";

const updateCategory = async ({ id, category }: CategoryUpdateMutationData) => {
  const { data } = await axiosInstance.patch<Category>(
    `${Routes.API.CATEGORIES}${id}`,
    category
  );
  return data;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    Category,
    Error,
    CategoryUpdateMutationData,
    unknown
  >({
    mutationFn: (data) => updateCategory(data),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORIES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORY] }),
      ]);

      const CategoryHref = {
        pathname: `/[username]${Routes.SITE.BACKOFFICE.CATEGORIES}[id]`,
        query: { id: data.id },
      };
      await router.push(CategoryHref);
    },
  });

  return mutation;
};
