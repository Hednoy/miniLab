import ApiError from "@/lib-server/error";
import { getOfficers } from "@/lib-server/services/officer";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { OfficersGetData } from "@/types/models";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const profilesGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

const profilesSaveSchema = z.object({});

const validateOfficerSave = withValidation({
  schema: profilesSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateOfficerSearchQueryParams = (
  params: QueryParamsType
): OfficersGetData => {
  const result = profilesGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as OfficersGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const parsedData = validateOfficerSearchQueryParams(params);

  const profiles = await getOfficers(parsedData);

  return Response.json(profiles);
};

export { GET };
