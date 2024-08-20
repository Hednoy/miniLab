import { Category } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Category
 */
export type CategoryCreateData = Pick<Category, "name" | "opm_code">;

// both create and update
export type CategoryCreateFormData = CategoryCreateData;

/**
 * update Category
 */
export type CategoryUpdateData = Partial<Pick<Category, "name" | "opm_code">>;

export type CategoryUpdateMutationData = {
  category: CategoryUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type CategoriesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
}>;
