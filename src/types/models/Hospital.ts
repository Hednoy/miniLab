import { SortDirection } from "..";
import { Hospital } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Hospital
 */
export type HospitalCreateData = Pick<
  Hospital,
  "name" | "address" | "phone_no"
>;

// both create and update
export type HospitalCreateFormData = HospitalCreateData;

/**
 * update Hospital
 */
export type HospitalUpdateData = Partial<
  Pick<Hospital, "name" | "address" | "phone_no">
>;

export type HospitalUpdateMutationData = {
  hospital: HospitalUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type HospitalsGetData = Partial<{
  page: number;
  limit: number;
  sort: string;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;

export type HospitalUpdateForm = {
  id: number;
  name?: string;
  address?: string;
  phone_no: string;
};
