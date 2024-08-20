import { NewsType } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create NewsType
 */
export type NewsTypeCreateData = Pick<
  NewsType,
  "code" | "name" | "description" | "is_active"
>;

// both create and update
export type NewsTypeCreateFormData = NewsTypeCreateData;

/**
 * update NewsType
 */
export type NewsTypeUpdateData = Partial<
  Pick<NewsType, "code" | "name" | "description" | "is_active">
>;

export type NewsTypeUpdateMutationData = {
  news_type: NewsTypeUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type NewsTypesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;
