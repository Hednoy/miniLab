// import prisma from "@/lib-server/prisma";
// import ApiError from "@/lib-server/error";
// import {
//   PersonCreateData,
//   PersonsGetData,
//   PersonUpdateData,
// } from "@/types/models";
// import { PaginatedResponse, SortDirection } from "@/types";
// import { filterSearchTerm } from "@/utils";
// import { Person, Prisma } from "@prisma/client";
// import { generateUUID } from "@/pages/api/helper/generateUUID";

// export const getPerson = async (id: number): Promise<Person> => {
//   const person = await prisma.person.findUnique({
//     where: { id },
//   });

//   if (!person) throw new ApiError(`Person with id: ${id} not found.`, 404);

//   return person;
// };

// const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

// export const getPersons = async (
//   personsGetData: PersonsGetData = {}
// ): Promise<PaginatedResponse<Person>> => {
//   const {
//     page = 1,
//     limit = defaultLimit,
//     searchTerm,
//     sortDirection,
//   } = personsGetData;

//   const search = filterSearchTerm(searchTerm);

//   const where: Prisma.PersonWhereInput = {};

//   if (search) {
//     where.first_name = { contains: search };
//   }

//   const totalCount = await prisma.person.count({ where });

//   let persons = await prisma.person.findMany({
//     where,
//     skip: (page - 1) * limit,
//     take: limit,
//     orderBy: {
//       updated_at: sortDirection as SortDirection,
//     },
//   });

//   persons = Array.isArray(persons) ? persons : [];

//   const result = {
//     items: persons.map((person) => person),
//     pagination: {
//       total: totalCount,
//       pagesCount: Math.ceil(totalCount / limit),
//       currentPage: page,
//       perPage: limit,
//       from: (page - 1) * limit + 1, // from item
//       to: (page - 1) * limit + persons.length,
//       hasMore: page < Math.ceil(totalCount / limit),
//     },
//   };

//   return result;
// };

// export const getPersonById = async (id: number): Promise<Person> => {
//   const person = await prisma.person.findUnique({
//     where: { id },
//   });

//   if (!person) throw new ApiError(`Person with id: ${id} not found.`, 404);

//   return person;
// };

// export const createPerson = async (
//   personCreateData: PersonCreateData
// ): Promise<Person> => {
//   const data: Prisma.PersonCreateInput = {
//     id_card: "",
//     first_name: "",
//     last_name: "",
//     mobile_phone: "",
//   };

//   const person = await prisma.person.create({
//     data: {
//       ...data,
//       ...personCreateData,
//     },
//   });

//   if (!person) throw new ApiError("Person not created.", 400);

//   // convert Person to PersonWithAuthor
//   const personWithAuthor = await prisma.person.findUnique({
//     where: {
//       id: person.id,
//     },
//   });

//   if (!personWithAuthor) throw new ApiError("Create category failed.", 400);

//   return personWithAuthor;
// };

// export const updatePerson = async (
//   id: number,
//   personUpdateData: PersonUpdateData
// ): Promise<Person> => {
//   const {
//     email,
//     first_name,
//     last_name,
//     mobile_phone,
//     telephone,
//     title_name,
//     id_card,
//     address,
//     postcode,
//     amphure_id,
//     province_id,
//     tombon_id,
//   } = personUpdateData;

//   const _person = await prisma.person.findUnique({ where: { id } });
//   if (!_person) throw new ApiError(`Person with id: ${id} not found.`, 404);

//   const data = {
//     ...(email && { email }),
//     ...(title_name && { title_name }),
//     ...(first_name && { first_name }),
//     ...(last_name && { last_name }),
//     ...(mobile_phone && { mobile_phone }),
//     ...(telephone && { telephone }),
//     ...(id_card && { id_card }),
//     ...(address && { address }),
//     ...(postcode && { postcode }),
//     ...(amphure_id && { amphure_id }),
//     ...(province_id && { province_id }),
//     ...(tombon_id && { tombon_id }),
//   };

//   const person = await prisma.person.update({
//     where: { id },
//     data,
//   });

//   if (!person) throw new ApiError("Update category failed.", 400);

//   return person;
// };

// export const deletePerson = async (id: number): Promise<Person> => {
//   const _person = await prisma.person.findUnique({ where: { id } });
//   if (!_person) throw new ApiError(`Person with id: ${id} not found.`, 404);

//   const person = await prisma.person.delete({
//     where: { id },
//   });

//   if (!person) throw new ApiError("Delete category failed.", 400);

//   return person;
// };
