import ApiError from "@/lib-server/error";
import { createNews, getNewsList } from "@/lib-server/services/news";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import {
  NewsCreateData,
  NewsCreateFormData,
  NewssGetData,
} from "@/types/models/News";
import { withValidation } from "next-validations";
import { NextRequest } from "next/server";
import { z } from "zod";

const newsGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
  date: z.string().optional().or(z.literal("")),
  news_type_id: z.preprocess(stringToNumber, z.number().optional()),
});

const validateNewsSearchQueryParams = (
  params: QueryParamsType
): NewssGetData => {
  const result = newsGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as NewssGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    // Debugging: Log the params to verify the presence of news_type_id
    console.log("Received params:", params);

    const parsedData = validateNewsSearchQueryParams(params);

    // Debugging: Log the parsed data to verify the presence of news_type_id
    console.log("Parsed data:", parsedData);

    const news = await getNewsList(parsedData);

    return Response.json(news);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

// Generate a POST method handler for create News
const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as NewsCreateFormData;

    // data = await validateNewsSave(data);
    const news = await createNews(data);

    return Response.json(news);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };
