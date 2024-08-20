import ApiError from "@/lib-server/error";
import {
  createTestType,
  getTestTypeList,
} from "@/lib-server/services/test-type";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { TestTypeCreateData, TestTypesGetData } from "@/types/models/TestType";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const testTypeGetSchema = z.object({
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

const testTypeSaveSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const validateTestTypeSave = withValidation({
  schema: testTypeSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateTestTypeSearchQueryParams = (
  params: QueryParamsType
): TestTypesGetData => {
  const result = testTypeGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as TestTypesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateTestTypeSearchQueryParams(params);

    const testTypes = await getTestTypeList(parsedData);

    return Response.json(testTypes);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create TestType
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as TestTypeCreateData;

    const testType = await createTestType(data);

    return Response.json(testType);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
