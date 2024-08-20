import { Member } from "@prisma/client";
import { RequiredNotNull, SortDirection } from "..";

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientUser = Omit<Member, "password">;

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create user, password is required
 */
export type UserCreateData = RequiredNotNull<Pick<Member, "password">>;

export type UserCreateFormData = {
  citizen_id: string;
  mobile_phone: string;
  title_name?: string;
  first_name: string;
  last_name: string;
  gender: string;
  email?: string;
  password: string;
  role_id: number;
  position: string;
  department: string;
};

/**
 * update user
 */
export type UserUpdateData = Partial<
  Omit<UserUpdateFormData, "confirmPassword">
>;

// for indexing with []
export type UserUpdateDataKeys = keyof UserUpdateData;

export type UserUpdateMutationData = {
  id: number;
  password: string;
  title_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  mobile_phone: string;
  email: string;
  occupation?: string;
  organization?: string;
  age?: number;
  amphure_id?: number;
  tombon_id?: number;
  province_id?: number;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type UserUpdateFormData = {
  name: string;
  username: string;
  avatar: File | null;
  header: File | null;
  bio: string;
  password: string;
  confirmPassword: string;
};

// updateUser service on server
export type UserUpdateServiceData = Partial<{
  name: string;
  username: string;
  bio: string;
  password: string;
  files: any; // this is different
}>;

// --------- Query params request types ----------
// used in queries and api args validation

export type UsersGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
}>;

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;

// --------- NextAuth authorize() callback args types ----------

export type UserLoginData = {
  username: string;
  password: string;
};

export type ManagementUser = {
  id?: any;
  firstname: string;
  lastname: string;
  idnumber: string;
  nickname: string;
  phonenumber: string;
  position: string;
  department: string;
  email: string;
  username: string;
  password: string;
};

export type ManagementUserPosition = {
  id?: any;
  position: string;
  department: string;
  permission: any[];
};
