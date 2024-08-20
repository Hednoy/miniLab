import { News } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create News
 */
export type NewsCreateData = Pick<
  News,
  | "title"
  | "description"
  | "date_start"
  | "date_end"
  | "type_id"
  | "view_count"
  | "is_active"
>;

// both create and update
export type NewsImages = {
  news_id?: number;
  file_name: string;
  file_path: string;
};

export type NewsCreateFormData = {
  title: string;
  description: string;
  date_start: Date | null;
  date_end: Date | null;
  type_id: number;
  view_count: number;
  is_active: boolean;
  images: NewsImages[];
};

/**
 * update News
 */
export type NewsUpdateData = Partial<
  Pick<
    News,
    | "title"
    | "description"
    | "date_start"
    | "date_end"
    | "type_id"
    | "view_count"
    | "is_active"
  >
>;

export type NewsUpdateFormData = {
  title: string;
  description: string;
  date_start: Date | null;
  date_end: Date | null;
  type_id: number;
  view_count: number;
  is_active: boolean;
  images: NewsImages[];
};

export type NewsUpdateMutationData = {
  news: NewsUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type NewssGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
  date: string;
  new_type_id: number;
}>;

export type NewsUpdateForm = NewsUpdateFormData & { id: number };
export type NewsGetDataForm = NewsCreateFormData & {
  id: number;
  created_at: Date | null;
};
