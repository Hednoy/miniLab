import ApiError from "@/lib-server/error";
import { createMachine, getMachineList } from "@/lib-server/services/machine";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { MachineCreateFormData, MachinesGetData } from "@/types/models/Machine";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const machineGetSchema = z.object({
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

const machineSaveSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  test_type_id: z.number(),
});

const validateMachineSave = withValidation({
  schema: machineSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateMachineSearchQueryParams = (
  params: QueryParamsType
): MachinesGetData => {
  const result = machineGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as MachinesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateMachineSearchQueryParams(params);

    const machines = await getMachineList(parsedData);

    return Response.json(machines);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create Machine
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as MachineCreateFormData;

    const machine = await createMachine(data);
    // const machine = await createMachine(body);
    return Response.json(machine);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
