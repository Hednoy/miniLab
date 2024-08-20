import ApiError from "@/lib-server/error";
import { getProvinces } from "@/lib-server/services";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { ProvincesGetData } from "@/types/models";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const provincesGetSchema = z.object({
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

const validateProvincesSearchQueryParams = (
  params: QueryParamsType
): ProvincesGetData => {
  const result = provincesGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as ProvincesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const parsedData = validateProvincesSearchQueryParams(params);
  console.log("parsedData", parsedData);
  const provinces = await getProvinces(parsedData);
  // res.status(200).json(provinces);
  return Response.json(provinces);
};

export { GET };
