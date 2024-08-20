import ApiError from "@/lib-server/error";
import { createPatient, getPatientList } from "@/lib-server/services/patient";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { PatientCreateData, PatientsGetData } from "@/types/models/Patient";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const patientGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  sort: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

const patientSaveSchema = z.object({});

const validatePatientSave = withValidation({
  schema: patientSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validatePatientSearchQueryParams = (
  params: QueryParamsType
): PatientsGetData => {
  const result = patientGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as PatientsGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validatePatientSearchQueryParams(params);

    const patients = await getPatientList(parsedData);

    return Response.json(patients);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create Patient
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as PatientCreateData;

    const patient = await createPatient(data);
    // const patient = await createPatient(body);
    return Response.json(patient);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
