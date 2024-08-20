import ApiError from "@/lib-server/error";
import { createRole, getRoleList } from "@/lib-server/services/role";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { RoleCreateFormData, RolesGetData } from "@/types/models/Role";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const roleGetSchema = z.object({
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

const roleSaveSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const validateRoleSave = withValidation({
  schema: roleSaveSchema.omit({}),
  type: "Zod",
  mode: "body",
});

const validateRoleSearchQueryParams = (
  params: QueryParamsType
): RolesGetData => {
  const result = roleGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as RolesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateRoleSearchQueryParams(params);

    const roles = await getRoleList(parsedData);

    return Response.json(roles);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as RoleCreateFormData;
    const role = await createRole(data);
    return Response.json(role);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
