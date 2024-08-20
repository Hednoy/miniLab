import { SortDirection } from "..";
import { OfficerLog, Officer, Member } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create OfficerLog
 */
export type OfficerLogCreateData = Pick<
  OfficerLog,
  "officer_id" | "action" | "action_by" | "action_at"
>;

// both create and update
export type OfficerLogCreateFormData = OfficerLogCreateData;

/**
 * update OfficerLog
 */
export type OfficerLogUpdateData = Partial<
  Pick<OfficerLog, "officer_id" | "action" | "action_by" | "action_at">
>;

export type OfficerLogUpdateMutationData = {
  OfficerLog: OfficerLogUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type OfficerLogsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type OfficerLogOfficer = Officer & { Officer: Officer };

export type OfficerLogList = OfficerLog & {
  id: number;
  Officer: OfficerLogOfficer;
};

export type LogActionCreate = {
  officer_id?: number;
  action: string;
};

export type OfficerMember = Officer & { member: Member };

export type LogActionList = OfficerLog & { Officer: OfficerMember };
