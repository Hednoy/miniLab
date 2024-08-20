import ApiError from "@/lib-server/error";
import { createOfficer, getOfficers } from "@/lib-server/services/officer";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { OfficerCreateFormData, OfficersGetData } from "@/types/models";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const officersGetSchema = z.object({
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

const officersSaveSchema = z.object({});

const validateOfficerSave = withValidation({
  schema: officersSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateOfficersSearchQueryParams = (
  params: QueryParamsType
): OfficersGetData => {
  const result = officersGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as OfficersGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateOfficersSearchQueryParams(params);

    const officers = await getOfficers(parsedData);

    return Response.json(officers);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create Officer
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as OfficerCreateFormData;

    console.log("POST", data);

    const officer = await createOfficer(data);

    return Response.json(officer);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
