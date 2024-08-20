import { Tambons } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Tambons
 */
export type TambonsCreateData = Pick<
  Tambons,
  "name_en" | "name_th" | "zip_code" | "amphure_id"
>;

// both create and update
export type TambonsCreateFormData = TambonsCreateData;

/**
 * update Tambons
 */
export type TambonsUpdateData = Partial<
  Pick<Tambons, "name_en" | "name_th" | "zip_code" | "amphure_id">
>;

export type TambonsUpdateMutationData = {
  tambons: TambonsUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type TambonsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  amphureId: number;
  sortDirection: SortDirection;
}>;
