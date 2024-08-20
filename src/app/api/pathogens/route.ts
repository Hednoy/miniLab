import ApiError from "@/lib-server/error";
import {
  createPathogens,
  getPathogensList,
} from "@/lib-server/services/pathogens";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import {
  PathogensCreateFormData,
  PathogenssGetData,
} from "@/types/models/Pathogens";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const pathogensGetSchema = z.object({
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

const pathogensSaveSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const validatePathogensSave = withValidation({
  schema: pathogensSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validatePathogensSearchQueryParams = (
  params: QueryParamsType
): PathogenssGetData => {
  const result = pathogensGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as PathogenssGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validatePathogensSearchQueryParams(params);

    const pathogens = await getPathogensList(parsedData);

    return Response.json(pathogens);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as any;
    const pathogens = await createPathogens(data);
    return Response.json(pathogens);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
    });
  }
};

export { GET, POST };
