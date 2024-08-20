// import prisma, { exclude } from "@/lib-server/prisma";
// import ApiError from "@/lib-server/error";
// import {
//   ExampleCreateData,
//   ExamplesGetData,
//   ExampleUpdateData,
//   ExampleWithAuthor,
// } from "@/types/models/Example";
// import { PaginatedResponse, SortDirection } from "@/types";
// import { filterSearchTerm } from "@/utils";

// // -------- pages/api/examples/[id].ts

// export const getExample = async (id: number): Promise<ExampleWithAuthor> => {
//   const example = await prisma.example.findUnique({
//     where: { id },
//   });

//   if (!example) throw new ApiError(`Example with id: ${id} not found.`, 404);

//   return example;
// };

// export const updateExample = async (
//   id: number,
//   exampleUpdateData: ExampleUpdateData
// ): Promise<ExampleWithAuthor> => {
//   const { name } = exampleUpdateData;

//   // redundant, just that service can be standalone
//   const _example = await prisma.example.findUnique({ where: { id } });
//   if (!_example) throw new ApiError(`Example with id: ${id} not found.`, 404);

//   const data = {
//     ...(name && { name }),
//   };

//   const example = await prisma.example.update({
//     where: { id },
//     data,
//   });

//   if (!example) throw new ApiError("Update example failed.", 400);

//   return example;
// };

// export const deleteExample = async (id: number): Promise<ExampleWithAuthor> => {
//   const _example = await prisma.example.findUnique({ where: { id } });
//   if (!_example) throw new ApiError(`Example with id: ${id} not found.`, 404);

//   const example = await prisma.example.delete({
//     where: { id },
//   });

//   if (!example) throw new ApiError("Delete example failed.", 400);

//   return example;
// };

// // ---------- pages/api/examples/index.ts

// export const createExample = async (
//   userId: string,
//   exampleCreateData: ExampleCreateData
// ): Promise<ExampleWithAuthor> => {
//   const { name } = exampleCreateData;

//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) throw new ApiError(`Invalid user id: ${userId} not found.`, 400);

//   const example = await prisma.example.create({
//     data: {
//       name,
//     },
//   });

//   if (!example) throw new ApiError("Example not created.", 400);

//   // convert Example to ExampleWithAuthor
//   const exampleWithAuthor = await prisma.example.findUnique({
//     where: {
//       id: example.id,
//     },
//   });

//   if (!exampleWithAuthor) throw new ApiError("Create example failed.", 400);

//   return exampleWithAuthor;
// };

// const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

// export const getExamples = async (
//   examplesGetData: ExamplesGetData = {}
// ): Promise<PaginatedResponse<ExampleWithAuthor>> => {
//   const {
//     page = 1,
//     limit = defaultLimit,
//     searchTerm,
//     sortDirection,
//   } = examplesGetData;

//   const search = filterSearchTerm(searchTerm);

//   const totalCount = await prisma.example.count();

//   let examples = await prisma.example.findMany({
//     // ...where,
//     skip: (page - 1) * limit,
//     take: limit,
//     orderBy: {
//       updatedAt: sortDirection as SortDirection,
//     },
//   });

//   examples = Array.isArray(examples) ? examples : [];

//   const result = {
//     items: examples.map((example) => example),
//     pagination: {
//       total: totalCount,
//       pagesCount: Math.ceil(totalCount / limit),
//       currentPage: page,
//       perPage: limit,
//       from: (page - 1) * limit + 1, // from item
//       to: (page - 1) * limit + examples.length,
//       hasMore: page < Math.ceil(totalCount / limit),
//     },
//   };

//   // Math.ceil(1.4) = 2
//   // 23 1..10, 11..20, 21..23

//   return result;
// };
