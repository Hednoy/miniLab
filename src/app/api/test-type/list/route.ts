import ApiError from "@/lib-server/error";
import {
  createTestType,
  getTestTypeForDD,
  getTestTypeList,
} from "@/lib-server/services/test-type";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { TestTypeCreateData, TestTypesGetData } from "@/types/models/TestType";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const testTypes = await getTestTypeForDD();

    return Response.json(testTypes);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
