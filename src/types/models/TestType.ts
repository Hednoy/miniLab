import { SortDirection } from "..";
import { TestType } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create TestType
 */
export type TestTypeCreateData = Pick<
  TestType,
  "prefix_name" | "subfix_name" | "description"
>;

// both create and update
export type TestTypeCreateFormData = TestTypeCreateData;

/**
 * update TestType
 */
export type TestTypeUpdateData = Partial<
  Pick<TestType, "prefix_name" | "subfix_name" | "description">
>;

export type TestTypeUpdateMutationData = {
  testType: TestTypeUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type TestTypesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type TestTypeUpdateForm = TestTypeUpdateData & {
  id: number;
};

export type TestTypeForDD = {
  id: number;
  name: string;
};
