import ApiError from "@/lib-server/error";
import { createOfficerLog, getOfficerLogList } from "@/lib-server/services/log";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import {
  OfficerLogCreateFormData,
  OfficerLogsGetData,
} from "@/types/models/Log";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const officerLogGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  createdDate: z.string().optional().or(z.literal("")),
  sort: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

const officerLogSaveSchema = z.object({
  officer_id: z.number(),
  action: z.string(),
  action_by: z.string(),
  action_at: z.string(),
});

const validateOfficerLogSave = withValidation({
  schema: officerLogSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateOfficerLogSearchQueryParams = (
  params: QueryParamsType
): OfficerLogsGetData => {
  const result = officerLogGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as OfficerLogsGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateOfficerLogSearchQueryParams(params);

    const officerLogs = await getOfficerLogList(parsedData);
    return Response.json(officerLogs);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as OfficerLogCreateFormData;
    const officerLog = await createOfficerLog(data);
    return Response.json(officerLog);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

export { GET, POST };
