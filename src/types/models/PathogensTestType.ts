import { SortDirection } from "..";
import { PathogensTestType } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create PathogensTestType
 */
export type PathogensTestTypeCreateData = Pick<
  PathogensTestType,
  "name" | "description" | "pathogens_id" | "test_type_id"
>;

// both create and update
export type PathogensTestTypeCreateFormData = PathogensTestTypeCreateData;

/**
 * update PathogensTestType
 */
export type PathogensTestTypeUpdateData = Partial<
  Pick<
    PathogensTestType,
    "name" | "description" | "pathogens_id" | "test_type_id"
  >
>;

export type PathogensTestTypeUpdateMutationData = {
  PathogensTestType: PathogensTestTypeUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type PathogensTestTypesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  pathogens_id: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type PathogensTestTypeUpdateForm = PathogensTestTypeUpdateData & {
  id: number;
};
