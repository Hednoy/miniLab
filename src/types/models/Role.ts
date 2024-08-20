import { SortDirection } from "..";
import { Role } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Role
 */
export type RoleCreateData = Pick<
  Role,
  | "name"
  | "position"
  | "department"
  | "is_active"
  | "is_admin"
  | "permission_data"
  | "permission_history"
  | "permission_patient"
  | "permission_lab"
  | "permission_management"
  | "permission_news"
>;

// both create and update
export type RoleCreateFormData = RoleCreateData;

/**
 * update Role
 */
export type RoleUpdateData = Partial<
  Pick<
    Role,
    | "name"
    | "position"
    | "department"
    | "is_active"
    | "is_admin"
    | "permission_data"
    | "permission_history"
    | "permission_patient"
    | "permission_lab"
    | "permission_management"
    | "permission_news"
  >
>;

export type RoleUpdateMutationData = {
  role: RoleUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services
export type RolesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;

export type RoleUpdateForm = RoleUpdateData & { id: number };
