// import ApiError from "@/lib-server/error";
// import { getPersons } from "@/lib-server/services/person";
// import { stringToNumber } from "@/lib-server/validation";
// import { QueryParamsType } from "@/types";
// import { PersonsGetData } from "@/types/models";
// import { withValidation } from "next-validations";
// import { NextRequest } from "next/server";
// import { z } from "zod";

// const personsGetSchema = z.object({
//   page: z.preprocess(stringToNumber, z.number().min(1).optional()),
//   limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
//   searchTerm: z.string().optional().or(z.literal("")),
//   sortDirection: z
//     .string()
//     .optional()
//     .or(z.literal(""))
//     .or(z.literal("asc"))
//     .or(z.literal("desc")),
// });

// const personsSaveSchema = z.object({});

// const validatePersonsSave = withValidation({
//   schema: personsSaveSchema.omit({}),
//   type: "Zod",
//   mode: "body",
// });

// const validatePersonsSearchQueryParams = (
//   params: QueryParamsType
// ): PersonsGetData => {
//   const result = personsGetSchema.safeParse(params);
//   if (!result.success) throw ApiError.fromZodError(result.error);

//   return result.data as PersonsGetData;
// };

// const GET = async (request: NextRequest) => {
//   const {
//     nextUrl: { search },
//   } = request;
//   const urlSearchParams = new URLSearchParams(search);
//   const params = Object.fromEntries(urlSearchParams.entries());

//   const parsedData = validatePersonsSearchQueryParams(params);

//   const persons = await getPersons(parsedData);

//   return Response.json(persons);
// };

// export { GET };
