import ApiError from "@/lib-server/error";
import {
  getLabChartData,
  getLabTestChartData,
  getLabTestList,
} from "@/lib-server/services/dashboard";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabChartParams } from "@/types/models/Lab";
import { NextRequest } from "next/server";
import { z } from "zod";

const dashboardSchema = z.object({
  month: z.preprocess(stringToNumber, z.number().min(1).optional()),
});

const validateDashboardQueryParams = (
  params: QueryParamsType
): LabChartParams => {
  const result = dashboardSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as LabChartParams;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateDashboardQueryParams(params);

    const dashboard = await getLabChartData(parsedData?.month || 1);

    return Response.json(dashboard);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
