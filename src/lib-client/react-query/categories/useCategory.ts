import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Category } from "@prisma/client";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import QueryKeys from "../queryKeys";

const getCategory = async (id: number): Promise<Category> => {
  const { data } = await axiosInstance.get<Category>(
    `${Routes.API.CATEGORIES}${id}`
  );
  return data;
};

export const useCategory = (id: number) => {
  const query = useQuery<Category, AxiosError>({
    queryKey: [QueryKeys.CATEGORY, id],
    queryFn: () => getCategory(id),
  });

  // {
  //   enabled: !isNaN(id), // important for 0
  // }

  return query;
};
