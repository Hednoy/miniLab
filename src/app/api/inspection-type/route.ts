import ApiError from "@/lib-server/error";
import {
  createInspectionType,
  getInspectionTypeList,
} from "@/lib-server/services/inspection-type";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import {
  InspectionTypeCreateData,
  InspectionTypesGetData,
} from "@/types/models/InspectionType";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const inspectionTypeGetSchema = z.object({
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

const validateInspectionTypeSearchQueryParams = (
  params: QueryParamsType
): InspectionTypesGetData => {
  const result = inspectionTypeGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as InspectionTypesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateInspectionTypeSearchQueryParams(params);

    const inspectionTypes = await getInspectionTypeList(parsedData);

    return Response.json(inspectionTypes);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create InspectionType
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as InspectionTypeCreateData;

    const inspectionType = await createInspectionType(data);

    return Response.json(inspectionType);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
