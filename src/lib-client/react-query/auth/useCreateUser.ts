import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ClientUser, UserCreateData } from "@/types/models/User";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { AxiosError } from "axios";

const createUser = async (user: UserCreateData) => {
  const { data } = await axiosInstance.post<ClientUser>(Routes.API.USERS, user);
  return data;
};

export const useCreateUser = () => {
  const router = useRouter();

  const mutation = useMutation<ClientUser, AxiosError, UserCreateData, unknown>(
    {
      mutationFn: (data) => createUser(data),
      onSuccess: async () => {
        await router.push(Routes.SITE.LOGIN_USER);
      },
    }
  );

  return mutation;
};
