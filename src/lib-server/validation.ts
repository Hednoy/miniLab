import { z } from "zod";
import ApiError from "@/lib-server/error";
import { QueryParamsType } from "@/types";
import { UserGetData, UsersGetData } from "@/types/models/User";

const passwordMin = 6,
  passwordMax = 20,
  nameMin = 3,
  nameMax = 25,
  usernameMin = 3,
  usernameMax = 15;

export const userGetSchema = z
  .object({
    id: z.string().cuid().optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    username: z
      .string()
      .min(usernameMin)
      .max(usernameMax)
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.id || data.username || data.email, // false triggers message
    "Either id, username or email should be specified."
  );

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(passwordMin).max(passwordMax),
});

export const agentLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(passwordMin).max(passwordMax),
});

export const userRegisterSchema = z
  .object({
    citizen_id: z.string().min(13).max(13),
    mobile_phone: z.string().min(10).max(10),
    email: z.string().email().optional().or(z.literal("")),
    title_name: z.string().optional().or(z.literal("")),
    first_name: z.string().min(nameMin).max(nameMax),
    last_name: z.string().min(nameMin).max(nameMax),
    gender: z.string().optional().or(z.literal("")),
    password: z.string().min(passwordMin).max(passwordMax),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const agentRegisterSchema = z
  .object({
    username: z.string().min(usernameMin).max(usernameMax),
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(passwordMin).max(passwordMax),
    // +
    confirmPassword: z.string().optional().or(z.literal("")),
    first_name: z.string().min(nameMin).max(nameMax),
    last_name: z.string().min(nameMin).max(nameMax),
    role_id: z.number().min(1),
    organization_id: z.number().array().min(1),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const userUpdateSchema = z.object({
  password: z
    .string()
    .min(passwordMin)
    .max(passwordMax)
    .optional()
    .or(z.literal("")),
  first_name: z.string().min(nameMin).max(nameMax).optional().or(z.literal("")),
  last_name: z.string().min(nameMin).max(nameMax).optional().or(z.literal("")),
});

export const agentUpdateSchema = z.object({
  password: z
    .string()
    .min(passwordMin)
    .max(passwordMax)
    .optional()
    .or(z.literal("")),
  first_name: z.string().min(nameMin).max(nameMax).optional().or(z.literal("")),
  last_name: z.string().min(nameMin).max(nameMax).optional().or(z.literal("")),
});

// query params numbers are strings, parse them before validating
// only req.query are strings, req.body preservs correct types
export const stringToNumber = (numberArg: unknown): unknown => {
  const numberStr = numberArg as string;
  const result = numberStr
    ? parseInt(z.string().parse(numberStr), 10)
    : undefined;
  return result as unknown;
};

export const stringToBoolean = (booleanArg: unknown): unknown => {
  // convert (arg: string): boolean | undefined to (arg: unknown): unknown
  const booleanStr = booleanArg as string;
  const result = booleanStr
    ? z.string().parse(booleanStr) === "true"
    : undefined;
  return result as unknown;
};

export const queryLimitMax = 100;

export const usersGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(queryLimitMax).optional()
  ),
  searchTerm: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

export const agentsGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(queryLimitMax).optional()
  ),
  searchTerm: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

// ----------- manual validation with safeParse() -------------

export const validateUserIdCuid = (id: string): string => {
  const result = userIdCuidSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data.id;
};

// 1 user
export const validateUserSearchQueryParams = (
  params: QueryParamsType
): UserGetData => {
  const result = userGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as UserGetData;
};

// ----------- convert types with safeParse() -------------

// n users
export const validateUsersSearchQueryParams = (
  params: QueryParamsType
): UsersGetData => {
  const result = usersGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as UsersGetData;
};

export const userIdCuidSchema = z.object({
  id: z.string().cuid(),
});

// --------------- post ---------------

// ----------- manual validation with safeParse() -------------
