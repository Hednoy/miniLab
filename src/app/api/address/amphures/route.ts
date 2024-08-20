import ApiError from "@/lib-server/error";
import { getAmphures } from "@/lib-server/services";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { AmphuresGetData } from "@/types/models";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const amphuresGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  provinceId: z.preprocess(stringToNumber, z.number().min(1).optional()),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

const validateAmphuresSearchQueryParams = (
  params: QueryParamsType
): AmphuresGetData => {
  const result = amphuresGetSchema.safeParse(params);

  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as AmphuresGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  try {
    const parsedData = validateAmphuresSearchQueryParams(params);
    console.log("parsedData", parsedData);
    const amphures = await getAmphures(parsedData);
    return Response.json(amphures);
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { GET };
