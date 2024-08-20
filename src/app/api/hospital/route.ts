import ApiError from "@/lib-server/error";
import {
  createHospital,
  getHospitalList,
} from "@/lib-server/services/hospital";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { HospitalCreateData, HospitalsGetData } from "@/types/models/Hospital";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const hospitalGetSchema = z.object({
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

const validateHospitalSearchQueryParams = (
  params: QueryParamsType
): HospitalsGetData => {
  const result = hospitalGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as HospitalsGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateHospitalSearchQueryParams(params);

    const hospitals = await getHospitalList(parsedData);

    return Response.json(hospitals);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create Hospital
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as HospitalCreateData;

    const hospital = await createHospital(data);
    // const hospital = await createHospital(body);
    return Response.json(hospital);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
