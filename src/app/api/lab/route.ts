import ApiError from "@/lib-server/error";
import { createLab, getLabList } from "@/lib-server/services/lab";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabCreateFormData, LabsGetData } from "@/types/models/Lab";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const labGetSchema = z.object({
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
  test_type_id: z.preprocess(stringToNumber, z.number().optional()),
});

const labSaveSchema = z.object({
  test_type_id: z.number(),
  inspection_type_id: z.number(),
  case_no: z.string(),
  machine_id: z.number(),
  hospital_id: z.number(),
  patient_id: z.number(),
  detail: z.string(),
  paper_code: z.string(),
  comment: z.string(),
  detection_method: z.string(),
  status: z.string(),
});

const validateLabSave = withValidation({
  schema: labSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateLabSearchQueryParams = (params: QueryParamsType): LabsGetData => {
  const result = labGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as LabsGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateLabSearchQueryParams(params);

    const labs = await getLabList(parsedData);

    return Response.json(labs);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as LabCreateFormData;
    const lab = await createLab(data);
    return Response.json(lab);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

export { GET, POST };
