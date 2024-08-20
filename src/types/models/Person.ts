import { Person } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Person
 */
export type PersonCreateData = Pick<
  Person,
  | "title_name"
  | "first_name"
  | "last_name"
  | "age"
  | "address"
  | "province_id"
  | "amphure_id"
  | "tombon_id"
  | "postcode"
  | "email"
  | "mobile_phone"
  | "telephone"
  | "id_card"
>;

// both create and update
export type PersonCreateFormData = PersonCreateData;

/**
 * update Person
 */
export type PersonUpdateData = Partial<
  Pick<
    Person,
    | "title_name"
    | "first_name"
    | "last_name"
    | "age"
    | "address"
    | "province_id"
    | "amphure_id"
    | "tombon_id"
    | "postcode"
    | "email"
    | "mobile_phone"
    | "telephone"
    | "id_card"
  >
>;

export type PersonUpdateMutationData = {
  person: PersonUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type PersonsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;
