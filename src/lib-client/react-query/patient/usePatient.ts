import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../axios";
import QueryKeys from "../queryKeys";
import { Routes } from "@/lib-client/constants";
import { Patient } from "@prisma/client";
import { PatientList, PatientsGetData } from "@/types/models/Patient";

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    pagesCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMore: boolean;
  };
}

const getPatients = async (
  params: PatientsGetData
): Promise<PaginatedResponse<PatientList>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<PatientList>>(
    Routes.API.PATIENT,
    { params }
  );
  return data;
};

export const usePatients = (params: PatientsGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<PatientList>,
    AxiosError
  >({
    queryKey: [QueryKeys.PATIENT, params],
    queryFn: () => getPatients(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getPatient = async (id: number | undefined): Promise<Patient> => {
  const { data } = await axiosInstance.get<Patient>(
    `${Routes.API.PATIENT}/${id}`
  );
  return data;
};

export const usePatientById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<Patient, AxiosError>({
    queryKey: [QueryKeys.PATIENT, { id }],
    queryFn: () => getPatient(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
