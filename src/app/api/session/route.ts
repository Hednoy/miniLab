import { authOptions } from "@/lib-server/services/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}
