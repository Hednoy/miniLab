import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { AxiosError } from "axios";
import { Routes } from "@/lib-client/constants";
import { ClientUser } from "@/types/models/User";
import axiosInstance from "../axios";
import QueryKeys, { filterEmptyKeys } from "../queryKeys";

const getUser = async (id: number | undefined) => {
  if (!id) return null;

  const { data } = await axiosInstance.get<ClientUser>(
    `${Routes.API.USERS}${id}`
  );
  return data;
};

/**
 * gets entire user object based on user.id in session,
 * used only in MeProvider and accessed via context
 */
export const useMe = () => {
  const { data: session, status } = useSession(); // needs provider
  const id = session?.user?.id;

  const query = useQuery<ClientUser | null, AxiosError>({
    queryKey: filterEmptyKeys([QueryKeys.ME, id]),
    queryFn: () => {
      return getUser(id).catch((error) => {
        console.error("me query error: ", error.response);
        if (id && error.response?.status === 404) {
          signOut();
          throw error;
        }
        throw error;
      });
    },
    enabled: !!id,
  });

  // no need to prefetch because every page is under MeProvider

  return query;
};
