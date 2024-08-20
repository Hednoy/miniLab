import { Provinces } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Provinces
 */
export type ProvincesCreateData = Pick<
  Provinces,
  "name_en" | "name_th" | "geography_id"
>;

// both create and update
export type ProvincesCreateFormData = ProvincesCreateData;

/**
 * update Provinces
 */
export type ProvincesUpdateData = Partial<
  Pick<Provinces, "name_en" | "name_th" | "geography_id">
>;

export type ProvincesUpdateMutationData = {
  provinces: ProvincesUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type ProvincesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;
