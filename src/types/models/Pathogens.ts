import { SortDirection } from "..";
import { Pathogens } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Pathogens
 */
export type PathogensCreateData = Pick<
  Pathogens,
  "name" | "code" | "description" | "machine_id"
>;

// both create and update
export type PathogensCreateFormData = PathogensCreateData;

/**
 * update Pathogens
 */
export type PathogensUpdateData = Partial<
  Pick<Pathogens, "name" | "code" | "description" | "machine_id">
>;

export type PathogensUpdateMutationData = {
  Pathogens: PathogensUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type PathogenssGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  pathogens_id: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type PathogensUpdateForm = PathogensUpdateData & {
  id: number;
};
