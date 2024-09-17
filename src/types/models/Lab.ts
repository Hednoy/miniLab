import { update } from './../../lib-server/services/users';
import { inspect } from "util";
import { SortDirection } from "..";
import {
  Hospital,
  InspectionType,
  Lab,
  Machine,
  Patient,
  TestType,
} from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Lab
 */
export type LabCreateData = Pick<
  Lab,
  | "test_type_id"
  | "inspection_type_id"
  | "case_no"
  | "machine_id"
  | "hospital_id"
  | "patient_id"
  | "detail"
  | "paper_code"
  | "comment"
  | "detection_method"
  | "status"
  | "approve_by_id"
  | "approve_date"
  | "report_by_id"
  | "report_date"
  | "report_time"
  | "result"
  | "approve_time"
  | "count_update"
  | "updated_at"
>;

// both create and update
export type LabCreateFormData = {
  test_type_id: number;
  inspection_type_id: number;
  case_no: string;
  machine_id: number | null;
  hospital_id: number | null;
  patient_id: number | null;
  detail: string | null;
  paper_code: string | null;
  comment: string | null;
  detection_method: string | null;
  status: string | null;
  approve_by_id: number | null;
  approve_date: Date | null;
  approve_time: string | null;
  report_by_id: number | null;
  report_date: Date | null;
  report_time: string | null;
  result: number;
  count_update: number;
  updated_at: Date | null;
  updated_by: number | null;

  lab_tests: LabTestCreateData[];
  lab_attachments: LabAttachments[];
};

export type LabTestCreateData = {
  result: string;
  remark: string;
  pathogens_id: number;
};

export type LabAttachments = {
  name: string;
  description: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  inspection_type_id: number;
};

/**
 * update Lab
 */
export type LabUpdateData = Partial<
  Pick<
    Lab,
    | "test_type_id"
    | "inspection_type_id"
    | "case_no"
    | "machine_id"
    | "hospital_id"
    | "patient_id"
    | "detail"
    | "paper_code"
    | "comment"
    | "detection_method"
    | "status"
    | "approve_by_id"
    | "approve_date"
    | "approve_time"
    | "report_by_id"
    | "report_date"
    | "report_time"
    | "result"
    | "count_update"
    | "updated_at"
  >
>;

export type LabUpdateMutationData = {
  lab: LabUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type LabsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sort: string;
  sortDirection: SortDirection;
  test_type_id: number;
  inspection_type_id: number;
}>;

export type LabGetByID = {
  id: number;
  test_type_id: number;
  inspection_type_id: number;
  approve_by_id: number;
  approve_date: Date | null;
  approve_time: string | null;
  report_by_id: number;
  report_date: Date | null;
  report_time: string | null;
  case_no: string;
  machine_id: number;
  hospital_id: number;
  patient_id: number;
  detail: string;
  paper_code: string;
  comment: string;
  detection_method: string;
  status: string;
  result: number;
  test_type: TestType | null;
  hospital: Hospital | null;
  patient: Patient | null;
  inspection_type: InspectionType | null;
  machine: Machine;
  updated_at: Date | null;
  count_update: number;

  lab_tests: LabTestCreateData[];
  lab_attachments: LabAttachments[];
};

export type LabForReport = {
  title: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: string;
  hn_no: string;
  tel_no: string;
  id_card: string;
  hospital_name: string;
  test_name: string;
  collected_date: string;
  received_date: string;
  lab_no: string;
  specimen: string;
  result: string;
  description: string;
  comment: string;
  method: string;
  reporter: string;
  date_of_report: string;
  approver: string;
  date_of_approve: string;
  updated_at: Date | null;
  count_update: number;
};

export type LabSearchData = {
  id: number;
  detection_method: string;
  created_at: Date | null;
  case_no: string;
  paper_code: string;
  Hospital: {
    hospital_name: string;
  };
  TestType: {
    prefix_name: string;
    subfix_name: string;
  };
  Patient: {
    title: string;
    first_name: string;
    last_name: string;
    id_card: string;
    hn: string;
    an: string;
  };
  Machine: {
    name: string;
  };
  InspectionType: {
    name: string;
  };
  receive_date: string;
};

export type LabUpdateForm = LabCreateFormData & {
  id: number;
};

export type LabChart = {
  total: number;
  detected: number;
  detected_percentage: number;
  not_detected: number;
  not_detected_percentage: number;
  positive: number;
  positive_percentage: number;
  negative: number;
  negative_percentage: number;
  indeterminate: number;
  indeterminate_percentage: number;
  borderline: number;
  borderline_percentage: number;
};

export type LabChartParams = {
  month: number;
  test_type_id: number;
  pathogensId: number;
  startDate: string;
  endDate: string;
};
