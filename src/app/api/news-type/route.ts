import { getNewsTypes } from "@/lib-server/services/news";
import { NextRequest } from "next/server";

const GET = async (request: NextRequest) => {
  try {
    const news = await getNewsTypes();

    return Response.json(news);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
