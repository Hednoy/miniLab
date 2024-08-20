import { ClientUser } from "@/types/models/User";
import { PrismaClient, Member } from "@prisma/client";

let prisma: PrismaClient;

// only on server
if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
      log: ["query"],
    });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default prisma;

export const exclude = <T, Key extends keyof T>(
  model: T,
  ...keys: Key[]
): Omit<T, Key> => {
  if (!model) throw new Error("Model arg is missing.");

  for (const key of keys) {
    delete model[key];
  }
  return model;
};

export const excludeFromUser = (user: Member): ClientUser => {
  return exclude(user, "password");
};
