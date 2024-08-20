import { Officer } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Officer
 */
export type OfficerCreateData = Pick<
  Officer,
  | "first_name"
  | "last_name"
  | "nickname"
  | "mobile_phone"
  | "email"
  | "telephone"
  | "is_active"
  | "member_id"
  | "position"
  | "department"
>;

export type OfficerIsActiveUpdate = {
  is_active: boolean;
};

// both create and update
export type OfficerCreateFormData = {
  citizen_id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  mobile_phone: string;
  email: string;
  username: string;
  password: string;
  is_active: boolean;
  position: string;
  department: string;
  role_id: number;
};

// get officer by id
export type OfficerGetByID = {
  id: number;
  citizen_id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  mobile_phone: string;
  email: string;
  username: string;
  // password: string;
  is_active: boolean;
  position: string;
  department: string;
  role_id: number;
};

/**
 * update Officer
 */
export type OfficerUpdateData = Partial<
  Pick<
    Officer,
    | "citizen_id"
    | "first_name"
    | "last_name"
    | "nickname"
    | "mobile_phone"
    | "is_active"
    | "position"
    | "department"
  >
>;

export type OfficerUpdateMutationData = {
  Officer: OfficerUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type OfficersGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type OfficerUpdateForm = OfficerUpdateData & { id: number };

export type OfficerListData = {
  id: number;
  username: string;
  member: {
    id: number;
    username: string;
  };
  is_active: boolean;
};

export type OfficerGetData = {
  id: number;
  citizen_id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  mobile_phone: string;
  email: string;
  username: string;
  password: string;
  is_active: boolean;
  position: string;
  department: string;
  role_id: number;
};

export type OfficerUpdateStatus = {
  id: number;
  status: boolean;
};
