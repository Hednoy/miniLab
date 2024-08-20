import { SortDirection } from "..";
import { InspectionType } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create InspectionType
 */
export type InspectionTypeCreateData = Pick<
  InspectionType,
  "code" | "name" | "description"
>;

// both create and update
export type InspectionTypeCreateFormData = InspectionTypeCreateData;

/**
 * update InspectionType
 */
export type InspectionTypeUpdateData = Partial<
  Pick<InspectionType, "code" | "name" | "description">
>;

export type InspectionTypeUpdateMutationData = {
  inspectionType: InspectionTypeUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type InspectionTypesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type InspectionTypeUpdateForm = InspectionTypeUpdateData & {
  id: number;
};
