import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { AxiosError } from "axios";
import { AgentCreateData, ClientAgent } from "@/types/models/Agent";

const createAgent = async (agent: AgentCreateData) => {
  const { data } = await axiosInstance.post<ClientAgent>(
    Routes.API.AGENTS,
    agent
  );
  return data;
};

export const useCreateAgent = () => {
  const router = useRouter();

  const mutation = useMutation<
    ClientAgent,
    AxiosError,
    AgentCreateData,
    unknown
  >({
    mutationFn: (data) => createAgent(data),
    onSuccess: async () => {
      await router.push(Routes.SITE.LOGIN_AGENT);
    },
  });

  return mutation;
};
