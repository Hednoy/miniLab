import { SortDirection } from "..";
import { LabTest, Pathogens } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create LabTest
 */
export type LabTestCreateData = Pick<
  LabTest,
  "lab_id" | "result" | "remark" | "pathogens_id"
>;

// both create and update
export type LabTestCreateFormData = LabTestCreateData;

/**
 * update LabTest
 */
export type LabTestUpdateData = Partial<
  Pick<LabTest, "lab_id" | "result" | "remark" | "pathogens_id">
>;

export type LabTestUpdateMutationData = {
  labTest: LabTestUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type LabTestsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
  sort: string;
  dateStart: string;
  dateEnd: string;
  test_type_id: number;
  result?: string;
}>;

export type LabTestForReport = {
  id?: number;
  hn_no: string;
  an_no: string;
  case_no: string;
  created_at?: Date | null;
  hospital_name: string;
  fullname?: string;
  age?: number;
  gender?: string;
  id_cad: string;
} & {
  prefix_name?: string;
  subfix_name?: string;
  result?: string;
};

export type LabTestChart = {
  total: number;
  detected: number;
  detected_percentage: number;
  not_detected: number;
  not_detected_percentage: number;
};

export type LabTestChartParams = {
  // month: number;
  // test_type_id: number;
  pathogensId: number;
  startDate: string;
  endDate: string;
};

export type LabTestPDFData = {
  [key: string]: LabTestPathogen;
};

export type LabTestPathogen = {
  name: string;
  result: string;
  remark: string;
};
