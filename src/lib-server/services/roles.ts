// import {
//   ClientUser,
//   UserCreateFormData,
//   UserUpdateMutationData,
//   UsersGetData,
// } from "@/types/models/User";
// import { hash } from "bcryptjs";
// import ApiError from "../error";
// import { generateUUID } from "@/pages/api/helper/generateUUID";
// import prisma, { excludeFromUser } from "@/lib-server/prisma";
// import { PaginatedResponse } from "@/types";
// import { filterSearchTerm } from "@/utils";
// import { Person } from "@prisma/client";

// export const createRole = async (
//   userCreateData: UserCreateFormData
// ): Promise<ClientUser> => {
//   const {
//     citizen_id,
//     mobile_phone,
//     email,
//     password: _password,
//     title_name,
//     first_name,
//     last_name,
//     gender,
//     role_id,
//   } = userCreateData;

//   // unique citizen
//   const _user1 = await prisma.member.findFirst({
//     where: { username: citizen_id },
//   });
//   if (_user1)
//     throw new ApiError(
//       `User with citizen id : ${citizen_id} already exists.`,
//       409
//     );

//   const password = await hash(_password, 10);

//   const user = await prisma.member.create({
//     data: {
//       id: generateUUID(),
//       username: citizen_id,
//       password: password,
//       role_id: 5,
//     },
//   });

//   if (!user) throw new ApiError("Member create failed.", 400);

//   const person = await prisma.person.create({
//     data: {
//       id_card: citizen_id,
//       title_name: title_name,
//       first_name: first_name,
//       last_name: last_name,
//       gender: gender,
//       email: email,
//       mobile_phone: mobile_phone,
//       member_id: user.id,
//     },
//   });

//   if (!person) throw new ApiError("Person create failed.", 400);

//   return excludeFromUser(user);
// };

// const defaultLimit = parseInt(process.env.NEXT_PUBLIC_USERS_PER_PAGE);

// export const getAll = async (
//   usersGetData: UsersGetData = {}
// ): Promise<PaginatedResponse<Person>> => {
//   const {
//     page = 1,
//     limit = defaultLimit,
//     searchTerm,
//     sortDirection,
//   } = usersGetData;

//   const search = filterSearchTerm(searchTerm, "or");

//   const where = {
//     where: {
//       id_card: {
//         contains: search,
//       },
//       first_name: {
//         contains: search,
//       },
//       last_name: {
//         contains: search,
//       },
//       mobile_phone: {
//         contains: search,
//       },
//       email: {
//         contains: search,
//       },
//     },
//   };

//   const data = await prisma.person.findMany({
//     ...where,
//     skip: (page - 1) * limit,
//     take: limit,
//   });

//   const totalCount = await prisma.person.count({ ...where });

//   const result = {
//     items: data,
//     pagination: {
//       total: totalCount,
//       pagesCount: Math.ceil(totalCount / limit),
//       currentPage: page,
//       perPage: limit,
//       from: (page - 1) * limit + 1,
//       to: (page - 1) * limit + data.length,
//       hasMore: page < Math.ceil(totalCount / limit),
//     },
//   };

//   return result;
// };

// export const getById = async (id: string): Promise<Person | null> => {
//   return prisma.person.findUnique({
//     where: { id },
//   });
// };

// export const update = async (data: UserUpdateMutationData): Promise<Person> => {
//   const dataPerson = await prisma.person.update({
//     where: { id: data.id },
//     data: {
//       title_name: data.title_name,
//       first_name: data.first_name,
//       last_name: data.last_name,
//       gender: data.gender,
//       mobile_phone: data.mobile_phone,
//       email: data.email,
//       updated_at: new Date(),
//     },
//   });
//   prisma.member.update({
//     where: { id: dataPerson.member_id },
//     data: {
//       password: data.password,
//       updated_at: new Date(),
//     },
//   });

//   return dataPerson;
// };

// export const deleteById = async (id: string): Promise<Person | null> => {
//   const dataPerson = await prisma.person.update({
//     where: { id },
//     data: {
//       is_active: false,
//       updated_at: new Date(),
//     },
//   });
//   prisma.member.update({
//     where: { id: dataPerson.id },
//     data: {
//       is_active: false,
//       updated_at: new Date(),
//     },
//   });

//   return dataPerson;
// };
