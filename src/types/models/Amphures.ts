import { Amphures } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Amphures
 */
export type AmphuresCreateData = Pick<
  Amphures,
  "name_en" | "name_th" | "province_id"
>;

// both create and update
export type AmphuresCreateFormData = AmphuresCreateData;

/**
 * update Amphures
 */
export type AmphuresUpdateData = Partial<
  Pick<Amphures, "name_en" | "name_th" | "province_id">
>;

export type AmphuresUpdateMutationData = {
  amphures: AmphuresUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type AmphuresGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
  provinceId?: number;
}>;
