import ApiError from "@/lib-server/error";
import { getLabList, getLabTestList } from "@/lib-server/services/dashboard";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabsGetData } from "@/types/models/Lab";
import { LabTestsGetData } from "@/types/models/LabTest";
import { NextRequest } from "next/server";
import { z } from "zod";

const dashboardSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  dateStart: z.string().optional().or(z.literal("")),
  dateEnd: z.string().optional().or(z.literal("")),
  sort: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
  test_type_id: z.preprocess(stringToNumber, z.number().optional()),
  result: z.string().optional().or(z.literal("")),
});

const validateDashboardQueryParams = (params: QueryParamsType): LabsGetData => {
  const result = dashboardSchema.safeParse(params);
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

    const parsedData = validateDashboardQueryParams(params);

    const dashboard = await getLabList(parsedData);

    return Response.json(dashboard);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
