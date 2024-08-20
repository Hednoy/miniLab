import ApiError from "@/lib-server/error";
import { getCategories } from "@/lib-server/services/categories";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { CategoriesGetData } from "@/types/models";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const categoriesGetSchema = z.object({
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

const validateCategoriesSearchQueryParams = (
  params: QueryParamsType
): CategoriesGetData => {
  const result = categoriesGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as CategoriesGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const parsedData = validateCategoriesSearchQueryParams(params);

  const categories = await getCategories(parsedData);

  return Response.json(categories);
};

export { GET };
