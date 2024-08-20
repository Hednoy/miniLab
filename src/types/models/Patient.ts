import { SortDirection } from "..";
import { Hospital, InspectionType, Lab, Patient } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Patient
 */
export type PatientCreateData = Pick<
  Patient,
  | "hn"
  | "an"
  | "hospital_id"
  | "inspection_type_id"
  | "case_no"
  | "first_name"
  | "last_name"
  | "gender"
  | "age"
  | "id_card"
  | "passport"
  | "phone_no"
  | "visit_type"
  | "sat_id"
  | "is_anonymous"
  | "date_of_birth"
  | "date_of_send"
  | "collected_date"
  | "collected_time"
  | "received_date"
  | "received_time"
  | "title"
>;

// both create and update
export type PatientCreateFormData = PatientCreateData;

/**
 * update Patient
 */
export type PatientUpdateData = Partial<
  Pick<
    Patient,
    | "hn"
    | "an"
    | "hospital_id"
    | "inspection_type_id"
    | "case_no"
    | "first_name"
    | "last_name"
    | "gender"
    | "age"
    | "id_card"
    | "passport"
    | "phone_no"
    | "visit_type"
    | "sat_id"
    | "is_anonymous"
    | "date_of_birth"
    | "date_of_send"
    | "collected_date"
    | "collected_time"
    | "received_date"
    | "received_time"
  >
>;

export type PatientUpdateMutationData = {
  patient: PatientUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type PatientsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
}>;

export type PatientUpdateForm = PatientUpdateData & { id: number };

export type PatientList = Patient & {
  hospital: Hospital;
  InspectionType: InspectionType;
  Lab: Lab[];
};
