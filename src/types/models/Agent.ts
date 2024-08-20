import { Officer, Member } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { RequiredNotNull, SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

export type ClientAgent = Omit<Member, "password">;
/**
 * create user, password is required
 */
export type AgentCreateData = RequiredNotNull<
  Pick<Officer & Member, "username" | "password" | "role_id">
>;

export type AgentCreateFormData = {
  username: string;
  password: string;
  role_id: number;
  title_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_phone?: string;
  telephone?: string;
  is_active?: boolean;
  organization_id?: number[];
};

/**
 * update user
 */
export type AgentUpdateData = Partial<
  Omit<AgentUpdateFormData, "confirmPassword">
>;

// for indexing with []
export type AgentUpdateDataKeys = keyof AgentUpdateData;

export type AgentUpdateMutationData = {
  id: string;
  user: AgentUpdateData;
  setProgress: Dispatch<SetStateAction<number>>;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type AgentUpdateFormData = {
  id: number;
  username?: string;
  password?: string;
  role_id?: number;
  title_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_phone?: string;
  telephone?: string;
  is_active?: boolean;
  organization_id?: number[];
};

// updateUser service on server
export type UserUpdateServiceData = Partial<{
  id: number;
  username: string;
  password: string;
  role_id: number;
  title_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_phone?: string;
  telephone?: string;
  is_active?: boolean;
  organization_id?: number[];
}>;

// --------- Query params request types ----------
// used in queries and api args validation

export type AgentsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
}>;

export type AgentGetData = {
  id: number;
  username?: string;
  role_id?: number;
  role_name?: string;
  org: number[];
  org_name: string;
  title_name: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  mobile_phone: string | null;
};

// --------- NextAuth authorize() callback args types ----------

export type AgentLoginData = {
  username: string;
  password: string;
};
