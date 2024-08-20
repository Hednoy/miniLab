import "next-auth";
import { Token } from "@/lib-server/services/auth";

declare module "next-auth" {
  interface Session {
    user: Token;
    expires: string;
  }
}
