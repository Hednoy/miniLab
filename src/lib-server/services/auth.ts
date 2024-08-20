import prisma from "@/lib-server/prisma";
import { Member, Officer, Role } from "@prisma/client";
import ApiError from "../error";
import { UserLoginData } from "@/types/models/User";
import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Routes } from "@/lib-client/constants";
import { userLoginSchema } from "../validation";
import { compare } from "bcryptjs";

type UserToken = Member & { Officer?: Officer[] } & {
  Role?: Role;
};

export type Token = {
  id: number;
  officerId: number;
  name: string;
  email: string;
  role: string;
  role_id: number;
  permission_data: boolean;
  permission_history: boolean;
  permission_lab: boolean;
  permission_management: boolean;
  permission_news: boolean;
  permission_patient: boolean;
  is_admin: boolean;
};

export const loginUser = async ({
  username,
  password,
}: UserLoginData): Promise<{
  rsUser: UserToken | null;
  error: ApiError | null;
}> => {
  // validation only in this service
  const result = userLoginSchema.safeParse({ username, password });
  if (!result.success) {
    return {
      rsUser: null,
      error: ApiError.fromZodError(result.error),
    };
  }

  const user = await prisma.member.findFirst({
    where: { username },
    include: {
      Role: true,
      Officer: true,
    },
  });

  if (!user) {
    return {
      rsUser: null,
      error: new ApiError(`User : ${username} does not exist.`, 404),
    };
  }

  if (!user.is_active) {
    return {
      rsUser: null,
      error: new ApiError(`User : ${username} does not active.`, 401),
    };
  }

  const isValid = password && (await compare(password, user.password));

  if (!isValid) {
    return {
      rsUser: user,
      error: new ApiError("Invalid password.", 401),
    };
  }

  return { rsUser: user, error: null };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // redirect to same page and parse query params, unable to return api res
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ): Promise<any> {
        if (!credentials) throw new ApiError("undefined credentials", 400);
        const { rsUser, error } = await loginUser(credentials);
        if (error) throw error;

        if (rsUser != null) {
          const officer = rsUser?.Officer?.[0];
          const token: Token = {
            id: rsUser.id,
            officerId: officer?.id ?? 0,
            name: officer?.first_name + " " + officer?.last_name,
            email: officer?.email || "",
            role: rsUser?.Role?.name || "",
            role_id: rsUser?.role_id || 0,
            permission_data: rsUser?.Role?.permission_data || false,
            permission_history: rsUser?.Role?.permission_history || false,
            permission_lab: rsUser?.Role?.permission_lab || false,
            permission_management: rsUser?.Role?.permission_management || false,
            permission_news: rsUser?.Role?.permission_news || false,
            permission_patient: rsUser?.Role?.permission_patient || false,
            is_admin: rsUser?.Role?.is_admin || false,
          };

          return token;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // console.log("jwt callback token: ", token, "user : ", user);
      if (user) {
        const u = user as any;
        return {
          ...token,
          user: {
            id: u.id,
            officerId: u.officerId,
            name: u.name,
            email: u.email,
            role: u.role,
            role_id: u.role_id,
            permission_data: u.permission_data,
            permission_history: u.permission_history,
            permission_lab: u.permission_lab,
            permission_management: u.permission_management,
            permission_news: u.permission_news,
            permission_patient: u.permission_patient,
            is_admin: u.is_admin,
          },
        };
      }

      return token;
    },
    async session({ session, token }) {
      let _session: Session | undefined = undefined;
      const user = token.user as Token;
      if (user) {
        _session = {
          ...session,
          user: user,
        };
      }
      // console.log("session callback", _session);
      // console.log("token", token);
      return _session as Session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: "/auth/error",
    // signOut: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
};
