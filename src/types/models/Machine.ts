import { SortDirection } from "..";
import { Machine, TestType } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Machine
 */
export type MachineCreateData = Pick<
  Machine,
  | "code"
  | "name"
  | "description"
  | "rows"
  | "report_type"
  | "is_name"
  | "is_labno"
  | "is_gender"
  | "is_age"
  | "is_idcard"
  | "is_hn"
  | "is_an"
  | "is_hospital"
  | "is_specimens"
  | "is_satid"
  | "is_visittype"
  | "is_collecteddate"
  | "is_recieveddate"
  | "is_history"
  | "test_type_id"
>;

// both create and update
export type MachineCreateFormData = MachineCreateData;

/**
 * update Machine
 */
export type MachineUpdateData = Partial<
  Pick<
    Machine,
    | "code"
    | "name"
    | "description"
    | "rows"
    | "report_type"
    | "is_name"
    | "is_labno"
    | "is_gender"
    | "is_age"
    | "is_idcard"
    | "is_hn"
    | "is_an"
    | "is_hospital"
    | "is_specimens"
    | "is_satid"
    | "is_visittype"
    | "is_collecteddate"
    | "is_recieveddate"
    | "is_history"
    | "test_type_id"
  >
>;

export type MachineUpdateMutationData = {
  machine: MachineUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type MachinesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type MachineList = Machine & { TestType: TestType };
